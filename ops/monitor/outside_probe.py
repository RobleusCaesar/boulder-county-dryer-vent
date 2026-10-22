#!/usr/bin/env python3
"""BCDV outside-vantage probe.

Runs from somewhere other than the droplet (GitHub Actions, or a shell).
The droplet cannot see itself go down. Read-only GETs of public URLs.

Log-only unless the environment variable ALERTS_ENABLED is exactly "true".
When it is, a down component that stays down for 10 continuous minutes is
texted once via the Telnyx SMS API, and a single recovery text is sent after
it returns. A failed text is not retried. Time the probe did not observe does
not count toward those 10 minutes, and the incident stays open across a long
gap so there is still one down text and one recovery.
Secrets are read from the environment and are never written to state, the
outage log, or stdout.

Exit: 0 up (or only droplet-owned), 2 a component still down, 3 this vantage
cannot reach neutral sites (no verdict), 1 usage, persist failure, or
unexpected error.
"""
import argparse
import fcntl
import json
import os
import re
import shlex
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from datetime import datetime
from email.utils import parsedate_to_datetime
from zoneinfo import ZoneInfo

MT = ZoneInfo("America/Denver")
UA = "Mozilla/5.0 (compatible; bcdv-outside-probe/2; +https://bouldercountydryervent.com)"
HB_MAX_AGE = 15 * 60
# Epoch this far ahead of the Date header is not a fresh heartbeat.
HB_FUTURE_SKEW = 5 * 60
# Millisecond timestamps and other non-second values sit above this.
HB_EPOCH_MAX = 10_000_000_000
ALERT_AFTER = 10 * 60
# Unobserved time longer than this does not count toward the 10 continuous
# minutes. The incident itself stays open, so a long gap still yields one
# down text and one recovery.
CONTINUITY_GAP = 15 * 60
TELNYX_URL = "https://api.telnyx.com/v2/messages"
SECRET_ENV = ("TELNYX_API_KEY", "OWNER_PHONE", "FROM_NUMBER")

# name, url, expected status, kind
# sign_in is fetched with redirects disabled (see OPENER). 302 is not 200, so it is down.
CHECKS = [
    ("site", "https://bouldercountydryervent.com/", 200, "html"),
    ("book_page", "https://bouldercountydryervent.com/book/", 200, "html"),
    ("book_api", "https://api.bouldercountydryervent.com/book", 200, "book"),
    ("api_hb", "https://api.bouldercountydryervent.com/hb", 200, "hb"),
    ("sign", "https://sign.bouldercountydryervent.com/sign_in", 200, "html"),
]
NEUTRAL = [
    "https://www.google.com/generate_204",
    "https://cloudflare.com/cdn-cgi/trace",
]

LOG_HEADER = (
    "# Outside probe outage log\n\n"
    "Machine-written by outside_probe.py. Times are America/Denver.\n\n"
    "| start (MT) | end (MT) | duration | component | detail | resolution | ref |\n"
    "| --- | --- | --- | --- | --- | --- | --- |\n"
)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


OPENER = urllib.request.build_opener(NoRedirect)
PERSIST_FAILED = False
TOKEN_RE = re.compile(r"(?:ghp_|gho_|ghs_|github_pat_|glpat-)[A-Za-z0-9_]+")


def alerts_enabled():
    # Repository Actions variable only. Exactly "true"; "True", "1", and
    # whitespace stay log-only.
    return os.environ.get("ALERTS_ENABLED") == "true"


def secret_values():
    found = []
    for name in SECRET_ENV:
        value = os.environ.get(name) or ""
        if len(value) >= 8:
            found.append(value)
    return found


def redact(text):
    out = TOKEN_RE.sub("[redacted]", str(text))
    for secret in secret_values():
        if secret in out:
            out = out.replace(secret, "[redacted]")
    return out


def clip(text, limit=300):
    text = " ".join(redact(text).split())
    if len(text) <= limit:
        return text
    return text[: limit - 1] + "…"


def emit(obj):
    print(redact(json.dumps(obj, indent=1)), flush=True)


def progress(obj):
    print(redact(json.dumps(obj)), file=sys.stderr, flush=True)


def parse_http_date(value):
    """Return a unix timestamp for an HTTP Date header, or None."""
    if not value or not isinstance(value, str):
        return None
    try:
        parsed = parsedate_to_datetime(value.strip())
    except (TypeError, ValueError, IndexError, OverflowError):
        return None
    if parsed is None:
        return None
    try:
        return parsed.timestamp()
    except (OverflowError, OSError, ValueError):
        return None


def fetch(url, timeout=10, limit=65536):
    """Return (status, body, error, ms, date_header). status is None on transport failure.

    Redirects are not followed. A 302 comes back as status 302 plus the Location.
    """
    started = time.time()
    request = urllib.request.Request(
        url,
        headers={"User-Agent": UA, "Cache-Control": "no-cache"},
    )
    try:
        with OPENER.open(request, timeout=timeout) as response:
            body = response.read(limit).decode("utf-8", "replace")
            date_hdr = response.headers.get("Date") if response.headers else None
            elapsed = int((time.time() - started) * 1000)
            return response.status, body, None, elapsed, date_hdr
    except urllib.error.HTTPError as exc:
        headers = exc.headers
        location = headers.get("Location", "") if headers else ""
        date_hdr = headers.get("Date") if headers else None
        err = f"redirect to {location}" if location else None
        try:
            body = exc.read(limit).decode("utf-8", "replace")
        except Exception:
            body = ""
        elapsed = int((time.time() - started) * 1000)
        return exc.code, body, err, elapsed, date_hdr
    except Exception as exc:
        elapsed = int((time.time() - started) * 1000)
        return None, "", clip(f"{type(exc).__name__}: {exc}", 160), elapsed, None


def judge_hb(body, date_hdr, ms):
    """Heartbeat age uses the response Date header, never the runner clock."""
    try:
        payload = json.loads(body)
    except Exception as exc:
        return "down", f"HTTP 200 but invalid JSON: {type(exc).__name__}"
    if not isinstance(payload, dict):
        return "down", f"HTTP 200 but JSON is {type(payload).__name__}, not object"
    epoch = payload.get("epoch")
    if isinstance(epoch, bool) or not isinstance(epoch, (int, float)):
        return "down", "hb missing epoch"
    if epoch > HB_EPOCH_MAX:
        return "down", "hb epoch is not unix seconds"
    server_now = parse_http_date(date_hdr)
    if server_now is None:
        return "down", "hb missing or unparseable Date header"
    age = server_now - float(epoch)
    if age < -HB_FUTURE_SKEW:
        return "down", f"hb epoch is {abs(age) / 60:.0f} min ahead of Date"
    if age > HB_MAX_AGE:
        return "down", f"hb stale {age / 60:.0f} min (droplet health timer not running?)"
    if payload.get("ok") is not True:
        # Fresh heartbeat, not-ok: the droplet alerts on its own. Log only.
        return "droplet_owns", droplet_false_detail(payload, 200, age)
    return "ok", f"hb ok, age {age / 60:.1f} min via Date ({ms} ms); droplet ok: true"


def json_object(body):
    if not body:
        return None
    try:
        payload = json.loads(body)
    except Exception:
        return None
    return payload if isinstance(payload, dict) else None


def droplet_false_detail(payload, code, age=None):
    failing = payload.get("failing")
    status = f"HTTP {code}" if code is not None else "no response"
    fresh = f", age {age / 60:.1f} min" if isinstance(age, (int, float)) else ""
    return clip(f"{status} droplet ok: false{fresh} failing={failing!r}")


def check_once(name, url, want, kind):
    """Return (status, detail). status is ok, down, or droplet_owns."""
    code, body, err, ms, date_hdr = fetch(url)
    # A heartbeat that says ok:false is the droplet's alert, even on HTTP 503.
    if kind == "hb":
        payload = json_object(body)
        if payload is not None and payload.get("ok") is False:
            return "droplet_owns", droplet_false_detail(payload, code)
    if code is None:
        return "down", f"{err} ({ms} ms)"
    if code != want:
        extra = f" {err}" if err else ""
        return "down", f"HTTP {code}{extra} ({ms} ms)"
    if kind == "html":
        return "ok", f"HTTP {code} ({ms} ms)"
    if kind == "hb":
        return judge_hb(body, date_hdr, ms)
    try:
        payload = json.loads(body)
    except Exception as exc:
        return "down", f"HTTP {code} but invalid JSON: {type(exc).__name__}"
    if not isinstance(payload, dict):
        return "down", f"HTTP {code} but JSON is {type(payload).__name__}, not object"
    if payload.get("ok") is True:
        return "ok", f"bcdv-book ok ({ms} ms)"
    return "down", f"book api ok={payload.get('ok')!r}"


def check(item, retry_wait):
    status, detail = check_once(*item)
    if status == "down":
        time.sleep(retry_wait)
        status, retry_detail = check_once(*item)
        if status == "down":
            detail = f"{detail}; retry: {retry_detail}"
        else:
            detail = retry_detail
    return status, detail


def vantage_ok():
    for url in NEUTRAL:
        code, _body, _err, _ms, _date = fetch(url, timeout=8, limit=64)
        if code is not None and code < 500:
            return True
    return False


def load_state(path):
    try:
        with open(path) as handle:
            state = json.load(handle)
    except FileNotFoundError:
        return {}
    except Exception:
        state = None
    else:
        if isinstance(state, dict):
            return state
    try:
        os.replace(path, f"{path}.corrupt-{int(time.time())}")
    except OSError:
        pass
    return {}


def save_state(path, state, *, hook=True):
    """Write state. Return False when the persist hook fails. Never swallow that."""
    global PERSIST_FAILED
    parent = os.path.dirname(os.path.abspath(path))
    fd, tmp = tempfile.mkstemp(dir=parent, prefix=".probe-")
    try:
        with os.fdopen(fd, "w") as handle:
            json.dump(state, handle, indent=1)
            handle.write("\n")
        os.replace(tmp, path)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise
    command = os.environ.get("PROBE_AFTER_SAVE", "").strip()
    if not hook or not command or os.environ.get("PROBE_INSIDE_SAVE") == "1":
        return True
    os.environ["PROBE_INSIDE_SAVE"] = "1"
    try:
        completed = subprocess.run(shlex.split(command), check=False)
        if completed.returncode != 0:
            PERSIST_FAILED = True
            print("::error::probe state persist failed", file=sys.stderr, flush=True)
            progress({"event": "state_persist_failed", "exit": completed.returncode})
            return False
    except Exception as exc:
        PERSIST_FAILED = True
        print("::error::probe state persist failed", file=sys.stderr, flush=True)
        progress({"event": "state_persist_failed", "detail": clip(f"{type(exc).__name__}: {exc}", 120)})
        return False
    finally:
        os.environ.pop("PROBE_INSIDE_SAVE", None)
    return True


def mt(ts):
    return datetime.fromtimestamp(ts, MT).strftime("%Y-%m-%d %H:%M")


def cell(value):
    return clip(str(value).replace("|", "/"), 220)


def ensure_log(path):
    if not path:
        return
    parent = os.path.dirname(os.path.abspath(path))
    os.makedirs(parent, exist_ok=True)
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return
    fd, tmp = tempfile.mkstemp(dir=parent, prefix=".olog-")
    with os.fdopen(fd, "w") as handle:
        handle.write(LOG_HEADER)
    os.replace(tmp, path)


def log_open(path, comp, since, detail):
    ref = f"outside-probe:{comp}:{int(since)}"
    if not path:
        return ref
    ensure_log(path)
    with open(path, "a") as handle:
        handle.write(
            f"| {mt(since)} | OPEN | ongoing | outside: {comp} | {cell(detail)} | (open) | {ref} |\n"
        )
    return ref


def log_close(path, ref, comp, since, end, detail, resolution):
    mins = max(0, round((end - since) / 60))
    row = (
        f"| {mt(since)} | {mt(end)} | {mins} min | outside: {comp} | "
        f"{cell(detail)} | {cell(resolution)} | {ref} |\n"
    )
    if not path:
        return
    ensure_log(path)
    try:
        with open(path) as handle:
            lines = handle.readlines()
        for index, line in enumerate(lines):
            if ref in line and "| OPEN |" in line:
                lines[index] = row
                break
        else:
            lines.append(row)
        parent = os.path.dirname(os.path.abspath(path))
        fd, tmp = tempfile.mkstemp(dir=parent, prefix=".olog-")
        with os.fdopen(fd, "w") as handle:
            handle.writelines(lines)
        os.replace(tmp, path)
    except FileNotFoundError:
        with open(path, "a") as handle:
            handle.write(row)


def resolution_text(texted, would, recovery, droplet=None):
    if droplet is False:
        base = "standing down; droplet ok: false"
    elif droplet is True:
        base = "self-recovered; droplet ok: true"
    else:
        base = "self-recovered"
    if texted and recovery == "sent":
        extra = "; down text sent; recovery text sent"
    elif texted and recovery == "failed":
        extra = "; down text sent; recovery text failed"
    elif texted:
        extra = "; down text sent"
    elif would:
        extra = "; LOG-ONLY: 10-min text would have gone out (not sent)"
    else:
        extra = "; no text (under 10 min)"
    return base + extra


def recovery_message(name, mins, status):
    if name == "api_hb" and status == "droplet_owns":
        return f"BCDV outside check: api_hb standing down after {mins} min; droplet ok: false"
    if name == "api_hb":
        return f"BCDV outside check: api_hb recovered after {mins} min; droplet ok: true"
    return f"BCDV outside check: {name} recovered after {mins} min"


def send_text(message):
    """POST one SMS via Telnyx. The returned detail never includes secrets or a body."""
    if not alerts_enabled():
        return False, "log-only"
    key = os.environ.get("TELNYX_API_KEY") or ""
    to_number = os.environ.get("OWNER_PHONE") or ""
    from_number = os.environ.get("FROM_NUMBER") or ""
    if not key or not to_number or not from_number:
        return False, "alerts enabled but Telnyx settings are missing"
    message = str(message)
    for secret in (key, to_number, from_number):
        if secret and secret in message:
            return False, "refusing to send a message that contains a secret"
    payload = json.dumps({"from": from_number, "to": to_number, "text": message}).encode()
    request = urllib.request.Request(
        TELNYX_URL,
        data=payload,
        method="POST",
        headers={
            "Authorization": "Bearer " + key,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": UA,
        },
    )
    try:
        with OPENER.open(request, timeout=20) as response:
            response.read(2048)
            return True, f"telnyx HTTP {response.status}"
    except urllib.error.HTTPError as exc:
        try:
            exc.read(512)
        except Exception:
            pass
        return False, f"telnyx HTTP {exc.code}"
    except Exception as exc:
        return False, f"telnyx {type(exc).__name__}"


def note_down(cs, name, down, detail, events, state, state_path):
    """One down notice per incident. The sent flag is stored before the SMS."""
    message = clip(
        f"BCDV outside check: {name} down {down / 60:.0f} min ({detail})",
        480,
    )
    down_min = round(down / 60, 1)
    if not alerts_enabled():
        cs["would_texted"] = True
        events.append({
            "event": "would_text",
            "component": name,
            "down_min": down_min,
            "message": message,
        })
        save_state(state_path, state)
        return
    # Persist first. A failed send must not be tried again, and a failed
    # persist must not send a text the next run cannot see was claimed.
    cs["texted"] = True
    if not save_state(state_path, state):
        cs["texted"] = False
        save_state(state_path, state, hook=False)
        events.append({
            "event": "text_failed",
            "component": name,
            "down_min": down_min,
            "detail": "probe state persist failed",
        })
        return
    ok, info = send_text(message)
    event = {
        "event": "texted" if ok else "text_failed",
        "component": name,
        "down_min": down_min,
        "detail": info,
    }
    events.append(event)


def note_recovery(cs, name, now, events, state, state_path, status):
    """Return sent, failed, persist-failed, or no-text. No second attempt."""
    mins = max(0, round((now - cs["down_since"]) / 60))
    message = recovery_message(name, mins, status)
    if not cs.get("texted"):
        return "no-text"
    if cs.get("recovery_sent"):
        return "sent"
    if not alerts_enabled():
        return "no-text"
    cs["recovery_sent"] = True
    if not save_state(state_path, state):
        cs["recovery_sent"] = False
        save_state(state_path, state, hook=False)
        events.append({
            "event": "recovery_text_failed",
            "component": name,
            "detail": "probe state persist failed",
        })
        return "persist-failed"
    ok, info = send_text(message)
    if not ok:
        events.append({"event": "recovery_text_failed", "component": name, "detail": info})
        return "failed"
    events.append({
        "event": "texted_recovery",
        "component": name,
        "down_min": mins,
        "detail": info,
    })
    return "sent"


def close_component(state, name, cs, now, events, args, status):
    recovery = note_recovery(cs, name, now, events, state, args.state, status)
    if recovery == "persist-failed":
        # The sent flag never landed. Keep the incident so a later run can
        # send the one recovery, instead of closing with no record of it.
        return
    ref = cs.get("ref") or f"outside-probe:{name}:{int(cs['down_since'])}"
    droplet = None
    if name == "api_hb":
        droplet = status != "droplet_owns"
    if args.log:
        log_close(
            args.log,
            ref,
            name,
            cs["down_since"],
            now,
            cs.get("last_detail") or "",
            resolution_text(
                bool(cs.get("texted")),
                bool(cs.get("would_texted")),
                recovery,
                droplet,
            ),
        )
    events.append({
        "event": "recovered",
        "component": name,
        "down_min": round((now - cs["down_since"]) / 60, 1),
        "would_text_recovery": (
            bool(cs.get("would_texted"))
            and not bool(cs.get("texted"))
            and not alerts_enabled()
        ),
        "texted_recovery": recovery == "sent",
    })
    state["components"].pop(name, None)


def note_continuity(cs, name, now, events):
    """Start the 10-minute clock over when this incident was not observed lately.

    The incident, its ref, and the texted flag stay. Unobserved time does not
    count as continuous downtime.
    """
    last_seen = cs.get("last_seen", cs.get("down_since"))
    try:
        gap = now - float(last_seen)
    except (TypeError, ValueError):
        return False
    if gap <= CONTINUITY_GAP:
        return False
    cs["down_since"] = now
    events.append({
        "event": "continuity_reset",
        "component": name,
        "gap_min": round(gap / 60, 1),
    })
    return True


def run_pass(checks, state, args, now, events, results):
    comps = state.setdefault("components", {})
    for item in checks:
        name = item[0]
        status, detail = check(item, args.retry_wait)
        results[name] = {"status": status, "detail": detail}
        current = comps.get(name)
        if current is not None and (not isinstance(current, dict) or "down_since" not in current):
            comps.pop(name, None)
            current = None
        if status == "down":
            if not current:
                current = comps[name] = {
                    "down_since": now,
                    "last_seen": now,
                    "texted": False,
                    "last_detail": detail,
                }
                current["ref"] = log_open(args.log, name, now, detail) if args.log else None
                events.append({"event": "opened", "component": name, "detail": detail})
            else:
                # Only a still-down check moves the clock. A recovery keeps
                # the original incident through one recovery text.
                note_continuity(current, name, now, events)
            current["last_detail"] = detail
            current["last_seen"] = now
            down_for = now - float(current["down_since"])
            claimed = current.get("texted") or (
                current.get("would_texted") and not alerts_enabled()
            )
            if down_for >= ALERT_AFTER and not claimed:
                note_down(current, name, down_for, detail, events, state, args.state)
        else:
            if current:
                close_component(state, name, current, now, events, args, status)
            if status == "droplet_owns":
                events.append({"event": "droplet_owns", "component": name, "detail": detail})
    return comps


def finish(state, events, results, ok, when=None):
    if when is None:
        when = state.get("last_run") or time.time()
    comps = state.get("components") if isinstance(state.get("components"), dict) else {}
    emit({
        "at_mt": mt(when),
        "ok": ok,
        "log_only": not alerts_enabled(),
        "alerts_enabled": alerts_enabled(),
        "down": {
            name: {
                "down_min": round((when - item["down_since"]) / 60, 1),
                "detail": item.get("last_detail"),
            }
            for name, item in comps.items()
            if isinstance(item, dict) and "down_since" in item
        },
        "results": results,
        "events": events,
    })


def parse_args(argv=None):
    parser = argparse.ArgumentParser(prog="outside_probe", exit_on_error=False)

    def fail(message):
        emit({"ok": None, "error": f"usage: {message}"})
        raise SystemExit(1)

    parser.error = fail
    parser.add_argument("--state", required=True)
    parser.add_argument("--log", help="outage markdown log (omit = no log writes)")
    parser.add_argument("--recheck-wait", type=float, default=300)
    parser.add_argument("--rechecks", type=int, default=2)
    parser.add_argument("--retry-wait", type=float, default=5)
    parser.add_argument("--override", help="TEST ONLY: name=url to replace one check URL")
    try:
        return parser.parse_args(argv)
    except SystemExit:
        raise
    except (argparse.ArgumentError, argparse.ArgumentTypeError) as exc:
        fail(str(exc))


def main(argv=None):
    try:
        args = parse_args(argv)
    except SystemExit as exc:
        code = exc.code
        if code is None or code == 0:
            return 0
        return code if isinstance(code, int) else 1
    checks = list(CHECKS)
    if args.override:
        if "=" not in args.override:
            emit({"ok": None, "error": "usage: --override name=url"})
            return 1
        name, url = args.override.split("=", 1)
        checks = [((item[0], url, item[2], item[3]) if item[0] == name else item) for item in checks]

    parent = os.path.dirname(os.path.abspath(args.state))
    os.makedirs(parent, exist_ok=True)
    if args.log:
        ensure_log(args.log)

    lock_handle = open(args.state + ".lock", "w")
    try:
        fcntl.flock(lock_handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        emit({"ok": None, "event": "skipped: another probe run holds the lock"})
        return 0

    try:
        state = load_state(args.state)
        if not isinstance(state.get("components"), dict):
            state["components"] = {}
        events = []
        results = {}
        now = time.time()

        if not vantage_ok():
            events.append({
                "event": "vantage_down",
                "detail": "cannot reach neutral sites; no verdict, component state untouched",
            })
            state["last_vantage_down"] = now
            save_state(args.state, state)
            finish(state, events, results, None, when=now)
            return 3

        comps = run_pass(checks, state, args, now, events, results)
        passes = 0
        paused_at = None
        while comps and passes < args.rechecks:
            passes += 1
            state["last_run"] = time.time()
            save_state(args.state, state)
            progress({
                "event": "recheck_wait",
                "pass": passes,
                "seconds": args.recheck_wait,
                "down": sorted(comps),
            })
            started = time.time()
            time.sleep(args.recheck_wait)
            if time.time() - started > args.recheck_wait + 300:
                events.append({
                    "event": "reset_after_gap",
                    "detail": f"paused {(time.time() - started) / 60:.0f} min during recheck; stopping",
                })
                paused_at = started
                break
            if not vantage_ok():
                events.append({"event": "vantage_down", "detail": "during recheck; stopping"})
                break
            now = time.time()
            still = [item for item in checks if item[0] in comps]
            comps = run_pass(still, state, args, now, events, results)

        state["last_run"] = paused_at or time.time()
        save_state(args.state, state)
        finish(state, events, results, not comps)
        if comps:
            return 2
        if PERSIST_FAILED:
            return 1
        return 0
    finally:
        try:
            fcntl.flock(lock_handle, fcntl.LOCK_UN)
        finally:
            lock_handle.close()


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SystemExit:
        raise
    except Exception as exc:
        emit({"ok": None, "error": clip(f"{type(exc).__name__}: {exc}", 400)})
        sys.exit(1)
