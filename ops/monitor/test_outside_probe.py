#!/usr/bin/env python3
"""Unit tests for the outside probe. No network, no secrets, no real texts."""
import json
import os
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from email.utils import formatdate
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from io import StringIO
from pathlib import Path
from contextlib import redirect_stderr, redirect_stdout
import importlib.util

SPEC = importlib.util.spec_from_file_location(
    "outside_probe", Path(__file__).resolve().with_name("outside_probe.py")
)
probe = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(probe)

ENV_KEYS = ("ALERTS_ENABLED", "TELNYX_API_KEY", "OWNER_PHONE", "FROM_NUMBER", "PROBE_AFTER_SAVE")


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?", 1)[0]
        spec = self.server.routes.get(path, self.server.default)
        if callable(spec):
            spec = spec(path)
        body = spec.get("body", b"")
        if isinstance(body, str):
            body = body.encode()
        self.send_response_only(spec.get("code", 200))
        if spec.get("date"):
            self.send_header("Date", spec["date"])
        if spec.get("location"):
            self.send_header("Location", spec["location"])
        self.send_header("Content-Type", spec.get("ctype", "text/plain"))
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if body:
            self.wfile.write(body)

    def log_message(self, fmt, *args):
        return


class ProbeTest(unittest.TestCase):
    def setUp(self):
        self._checks = list(probe.CHECKS)
        self._neutral = list(probe.NEUTRAL)
        self._send = probe.send_text
        self._env = {key: os.environ.get(key) for key in ENV_KEYS}
        for key in ENV_KEYS:
            os.environ.pop(key, None)
        probe.PERSIST_FAILED = False
        probe.NEUTRAL = ["http://127.0.0.1:1"]
        self.servers = []
        self.sent = []

    def tearDown(self):
        probe.CHECKS = self._checks
        probe.NEUTRAL = self._neutral
        probe.send_text = self._send
        for key, value in self._env.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value
        for httpd in self.servers:
            httpd.shutdown()
            httpd.server_close()

    def enable_alerts(self):
        os.environ["ALERTS_ENABLED"] = "true"
        os.environ["TELNYX_API_KEY"] = "TELNYXTESTKEY123456"
        os.environ["OWNER_PHONE"] = "+15555550123"
        os.environ["FROM_NUMBER"] = "+15555550999"

    def serve(self, routes, default=None):
        httpd = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        httpd.routes = routes
        httpd.default = default or {"code": 500, "body": "no"}
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        self.servers.append(httpd)
        host, port = httpd.server_address
        return f"http://{host}:{port}"

    def run_probe(self, state_path, log_path, extra=()):
        buf = StringIO()
        with redirect_stdout(buf):
            code = probe.main([
                "--state", state_path,
                "--log", log_path,
                "--rechecks", "0",
                "--retry-wait", "0",
                *extra,
            ])
        text = buf.getvalue()
        self.assertNotIn("TELNYXTESTKEY", text)
        self.assertNotIn("+15555550123", text)
        self.assertNotIn("+15555550999", text)
        return code, json.loads(text)

    def test_date_header_not_runner_clock(self):
        epoch = 1_000_000_000
        fresh = formatdate(epoch + 60, usegmt=True)
        stale = formatdate(epoch + 20 * 60, usegmt=True)
        base = self.serve({
            "/fresh": {"code": 200, "date": fresh, "ctype": "application/json",
                       "body": json.dumps({"ok": True, "epoch": epoch})},
            "/stale": {"code": 200, "date": stale, "ctype": "application/json",
                       "body": json.dumps({"ok": True, "epoch": epoch})},
            "/owned": {"code": 200, "date": fresh, "ctype": "application/json",
                       "body": json.dumps({"ok": False, "epoch": epoch, "failing": ["disk"]})},
            "/nodate": {"code": 200, "ctype": "application/json",
                        "body": json.dumps({"ok": True, "epoch": epoch})},
            "/ms": {"code": 200, "date": fresh, "ctype": "application/json",
                    "body": json.dumps({"ok": True, "epoch": epoch * 1000})},
        })
        # Runner clock is decades ahead of this Date header. A clock-based age is stale.
        status, detail = probe.check_once("api_hb", base + "/fresh", 200, "hb")
        self.assertEqual(status, "ok", detail)
        self.assertIn("via Date", detail)

        status, detail = probe.check_once("api_hb", base + "/stale", 200, "hb")
        self.assertEqual(status, "down", detail)
        self.assertIn("stale", detail)

        status, detail = probe.check_once("api_hb", base + "/owned", 200, "hb")
        self.assertEqual(status, "droplet_owns", detail)

        status, _detail = probe.check_once("api_hb", base + "/nodate", 200, "hb")
        self.assertEqual(status, "down")

        status, detail = probe.check_once("api_hb", base + "/ms", 200, "hb")
        self.assertEqual(status, "down", detail)
        self.assertIn("unix seconds", detail)

    def test_runner_fresh_but_date_stale_is_down(self):
        epoch = time_now = __import__("time").time() - 30
        # Date header says the heartbeat is 20 minutes old. The runner clock does not.
        date_hdr = formatdate(epoch + 20 * 60, usegmt=True)
        base = self.serve({
            "/hb": {"code": 200, "date": date_hdr, "ctype": "application/json",
                    "body": json.dumps({"ok": True, "epoch": epoch})},
        })
        status, detail = probe.check_once("api_hb", base + "/hb", 200, "hb")
        self.assertEqual(status, "down", detail)
        self.assertGreater(time_now, 0)

    def test_sign_redirect_is_down_and_not_followed(self):
        hits = []

        def route(path):
            hits.append(path)
            if path == "/sign_in":
                return {"code": 302, "location": "/elsewhere", "body": ""}
            return {"code": 200, "body": "should-not-load", "ctype": "text/html"}

        base = self.serve({}, default=route)
        status, detail = probe.check_once("sign", base + "/sign_in", 200, "html")
        self.assertEqual(status, "down", detail)
        self.assertIn("302", detail)
        self.assertEqual(hits, ["/sign_in"])

    def test_book_requires_boolean_true(self):
        base = self.serve({
            "/ok": {"code": 200, "ctype": "application/json", "body": '{"ok": true}'},
            "/str": {"code": 200, "ctype": "application/json", "body": '{"ok": "true"}'},
        })
        status, _detail = probe.check_once("book_api", base + "/ok", 200, "book")
        self.assertEqual(status, "ok")
        status, detail = probe.check_once("book_api", base + "/str", 200, "book")
        self.assertEqual(status, "down", detail)

    def test_retry_once_absorbs_a_blip(self):
        hits = {"n": 0}

        def route(_path):
            hits["n"] += 1
            if hits["n"] == 1:
                return {"code": 500, "body": "blip"}
            return {"code": 200, "body": "ok", "ctype": "text/html"}

        base = self.serve({}, default=route)
        status, detail = probe.check(("site", base + "/", 200, "html"), 0)
        self.assertEqual(status, "ok", detail)
        self.assertEqual(hits["n"], 2)

    def test_outage_texts_once_then_recovers_once(self):
        def forbid(message):
            raise AssertionError(message)

        probe.send_text = forbid
        base = self.serve({
            "/down": {"code": 500, "body": "no"},
            "/up": {"code": 200, "body": "ok", "ctype": "text/html"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.CHECKS = [("site", base + "/down", 200, "html")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertTrue(payload["log_only"])
            self.assertFalse(payload["alerts_enabled"])
            self.assertEqual([event["event"] for event in payload["events"]], ["opened"])
            saved = json.loads(Path(state).read_text())
            self.assertFalse(saved["components"]["site"]["texted"])

            saved["components"]["site"]["down_since"] = __import__("time").time() - probe.ALERT_AFTER - 5
            Path(state).write_text(json.dumps(saved))
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            kinds = [event["event"] for event in payload["events"]]
            self.assertEqual(kinds, ["would_text"])
            saved = json.loads(Path(state).read_text())
            self.assertTrue(saved["components"]["site"]["would_texted"])
            self.assertFalse(saved["components"]["site"]["texted"])

            code, payload = self.run_probe(state, log)
            self.assertEqual([event["event"] for event in payload["events"]], [])
            saved = json.loads(Path(state).read_text())
            self.assertTrue(saved["components"]["site"]["would_texted"])
            self.assertFalse(saved["components"]["site"]["texted"])

            probe.CHECKS = [("site", base + "/up", 200, "html")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 0)
            kinds = [event["event"] for event in payload["events"]]
            self.assertEqual(kinds, ["recovered"])
            self.assertTrue(payload["events"][0]["would_text_recovery"])
            self.assertEqual(json.loads(Path(state).read_text())["components"], {})
            log_text = Path(log).read_text()
            self.assertNotIn("| OPEN |", log_text)
            self.assertIn("LOG-ONLY", log_text)
            self.assertEqual(log_text.count("outside-probe:site:"), 1)

            code, payload = self.run_probe(state, log)
            self.assertEqual(payload["events"], [])
            self.assertEqual(code, 0)

    def test_failed_text_is_not_sent_twice(self):
        calls = []

        def fake_send(message):
            saved = json.loads(Path(state).read_text())
            self.assertTrue(saved["components"]["site"]["texted"])
            calls.append(message)
            return False, "telnyx HTTP 401"

        probe.send_text = fake_send
        self.enable_alerts()
        base = self.serve({
            "/down": {"code": 500, "body": "no"},
            "/up": {"code": 200, "body": "ok", "ctype": "text/html"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.CHECKS = [("site", base + "/down", 200, "html")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            now = time.time()
            Path(state).write_text(json.dumps({
                "last_run": now - 60,
                "components": {
                    "site": {
                        "down_since": now - probe.ALERT_AFTER - 5,
                        "last_seen": now - 60,
                        "texted": False,
                        "last_detail": "HTTP 500",
                        "ref": "outside-probe:site:1",
                    }
                },
            }))
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertFalse(payload["log_only"])
            self.assertEqual(payload["events"][0]["event"], "text_failed")
            self.assertTrue(json.loads(Path(state).read_text())["components"]["site"]["texted"])
            self.assertEqual(len(calls), 1)
            self.assertIn("down", calls[0])
            self.assertNotIn("TELNYX", calls[0])

            code, payload = self.run_probe(state, log)
            self.assertEqual(payload["events"], [])
            self.assertTrue(json.loads(Path(state).read_text())["components"]["site"]["texted"])
            self.assertEqual(len(calls), 1)

            def fake_ok(message):
                calls.append(message)
                return True, "telnyx HTTP 200"

            probe.send_text = fake_ok
            probe.CHECKS = [("site", base + "/up", 200, "html")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 0)
            self.assertIn("texted_recovery", [event["event"] for event in payload["events"]])
            self.assertTrue(payload["events"][-1]["texted_recovery"])
            self.assertEqual(json.loads(Path(state).read_text())["components"], {})
            self.assertEqual(len(calls), 2)

            code, payload = self.run_probe(state, log)
            self.assertEqual(payload["events"], [])
            self.assertEqual(len(calls), 2)

    def test_failed_recovery_is_not_retried(self):
        calls = []

        def fake_send(message):
            saved = json.loads(Path(state).read_text())
            self.assertTrue(saved["components"]["site"]["recovery_sent"])
            self.assertNotIn("pending_recovery", saved)
            calls.append(message)
            return False, "telnyx HTTP 500"

        probe.send_text = fake_send
        self.enable_alerts()
        base = self.serve({
            "/up": {"code": 200, "body": "ok", "ctype": "text/html"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.CHECKS = [("site", base + "/up", 200, "html")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            now = time.time()
            Path(state).write_text(json.dumps({
                "last_run": now - 60,
                "components": {
                    "site": {
                        "down_since": now - 700,
                        "last_seen": now - 60,
                        "texted": True,
                        "last_detail": "HTTP 500",
                        "ref": "outside-probe:site:9",
                    }
                },
            }))
            code, first = self.run_probe(state, log)
            self.assertEqual(code, 0)
            self.assertIn("recovery_text_failed", [event["event"] for event in first["events"]])
            saved = json.loads(Path(state).read_text())
            self.assertNotIn("pending_recovery", saved)
            self.assertEqual(saved["components"], {})
            self.assertEqual(len(calls), 1)

            code, second = self.run_probe(state, log)
            self.assertEqual(code, 0)
            self.assertEqual(second["events"], [])
            self.assertEqual(len(calls), 1)

    def test_long_gap_keeps_one_alert_and_one_recovery(self):
        def forbid(message):
            raise AssertionError(message)

        probe.send_text = forbid
        self.enable_alerts()
        base = self.serve({
            "/down": {"code": 500, "body": "no"},
            "/up": {"code": 200, "body": "ok", "ctype": "text/html"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.CHECKS = [("site", base + "/down", 200, "html")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            now = time.time()
            opened = now - 3 * 3600
            Path(log).write_text(
                probe.LOG_HEADER
                + "| 2026-01-01 00:00 | OPEN | ongoing | outside: site | HTTP 500 | (open) | outside-probe:site:3 |\n"
            )
            Path(state).write_text(json.dumps({
                "last_run": opened,
                "components": {
                    "site": {
                        "down_since": opened,
                        "last_seen": opened,
                        "texted": True,
                        "last_detail": "HTTP 500",
                        "ref": "outside-probe:site:3",
                    }
                },
            }))
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertIn("continuity_reset", [event["event"] for event in payload["events"]])
            self.assertNotIn("texted", [event["event"] for event in payload["events"]])
            saved = json.loads(Path(state).read_text())
            self.assertTrue(saved["components"]["site"]["texted"])
            self.assertEqual(saved["components"]["site"]["ref"], "outside-probe:site:3")
            self.assertEqual(saved["components"]["site"]["down_since"], opened)
            self.assertGreater(saved["components"]["site"]["continuous_since"], opened)
            self.assertIn("| OPEN |", Path(log).read_text())

            calls = []

            def ok_send(message):
                calls.append(message)
                return True, "telnyx HTTP 200"

            probe.send_text = ok_send
            probe.CHECKS = [("site", base + "/up", 200, "html")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 0)
            self.assertEqual(len(calls), 1)
            self.assertIn("recovered", calls[0])
            mins = max(0, round((time.time() - opened) / 60))
            self.assertGreaterEqual(mins, 180)
            self.assertIn(f"after {mins} min", calls[0])
            closed = Path(log).read_text()
            self.assertIn(probe.mt(opened), closed)
            self.assertIn(f"{mins} min", closed)
            self.assertNotIn("| OPEN |", closed)
            self.assertEqual(json.loads(Path(state).read_text())["components"], {})
            self.assertEqual(closed.count("outside-probe:site:3"), 1)

    def test_short_gap_keeps_the_incident(self):
        base = self.serve({
            "/down": {"code": 500, "body": "no"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.CHECKS = [("site", base + "/down", 200, "html")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            now = __import__("time").time()
            down_since = now - 120
            Path(state).write_text(json.dumps({
                "last_run": now - 60,
                "components": {
                    "site": {
                        "down_since": down_since,
                        "texted": False,
                        "last_detail": "HTTP 500",
                        "ref": "outside-probe:site:4",
                    }
                },
            }))
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertEqual(payload["events"], [])
            saved = json.loads(Path(state).read_text())
            self.assertEqual(saved["components"]["site"]["down_since"], down_since)
            self.assertFalse(saved["components"]["site"]["texted"])

    def test_vantage_down_does_not_touch_components(self):
        probe.CHECKS = [("site", "http://127.0.0.1:1/", 200, "html")]
        probe.NEUTRAL = ["http://127.0.0.1:1/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            now = __import__("time").time()
            Path(state).write_text(json.dumps({
                "last_run": now - 30,
                "components": {
                    "site": {"down_since": now - 30, "texted": True, "last_detail": "x", "ref": "r"}
                },
            }))
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 3)
            self.assertIsNone(payload["ok"])
            self.assertEqual(payload["events"][0]["event"], "vantage_down")
            saved = json.loads(Path(state).read_text())
            self.assertTrue(saved["components"]["site"]["texted"])
            self.assertIn("last_vantage_down", saved)

    def test_hb_ok_false_does_not_open_an_incident(self):
        epoch = 1_000_000_000
        date_hdr = formatdate(epoch + 30, usegmt=True)
        base = self.serve({
            "/hb": {"code": 200, "date": date_hdr, "ctype": "application/json",
                    "body": json.dumps({"ok": False, "epoch": epoch, "failing": ["disk"]})},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.CHECKS = [("api_hb", base + "/hb", 200, "hb")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 0)
            self.assertEqual(payload["events"][0]["event"], "droplet_owns")
            self.assertEqual(json.loads(Path(state).read_text())["components"], {})
            self.assertNotIn("| OPEN |", Path(log).read_text())

    def test_rechecks_follow_a_failure(self):
        hits = {"check": 0, "neutral": 0}

        def route(path):
            if path == "/neutral":
                hits["neutral"] += 1
                return {"code": 204, "body": ""}
            hits["check"] += 1
            return {"code": 500, "body": "no"}

        base = self.serve({}, default=route)
        probe.CHECKS = [("site", base + "/down", 200, "html")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            buf = StringIO()
            with redirect_stdout(buf):
                code = probe.main([
                    "--state", state,
                    "--log", log,
                    "--rechecks", "2",
                    "--recheck-wait", "0",
                    "--retry-wait", "0",
                ])
            payload = json.loads(buf.getvalue())
            self.assertEqual(code, 2)
            self.assertEqual(payload["events"][0]["event"], "opened")
            # one try + one retry, on the opening pass and two rechecks
            self.assertEqual(hits["check"], 6)
            self.assertGreaterEqual(hits["neutral"], 3)

    def test_send_text_refuses_to_leak_secrets(self):
        os.environ["ALERTS_ENABLED"] = "true"
        os.environ["TELNYX_API_KEY"] = "TELNYXTESTKEY123456"
        os.environ["OWNER_PHONE"] = "+15555550123"
        os.environ["FROM_NUMBER"] = "+15555550999"
        ok, detail = probe.send_text("down TELNYXTESTKEY123456")
        self.assertFalse(ok)
        self.assertNotIn("TELNYXTESTKEY123456", detail)
        self.assertNotIn("+15555550123", detail)
        os.environ["TELNYX_API_KEY"] = ""
        ok, detail = probe.send_text("hello")
        self.assertFalse(ok)
        self.assertIn("missing", detail)
        self.assertNotIn("+15555550123", detail)
        self.assertNotIn("+15555550999", detail)

    def test_enabling_alerts_mid_outage_sends_the_down_text(self):
        calls = []

        def fake_send(message):
            calls.append(message)
            return True, "telnyx HTTP 200"

        probe.send_text = fake_send
        self.enable_alerts()
        base = self.serve({
            "/down": {"code": 500, "body": "no"},
            "/up": {"code": 200, "body": "ok", "ctype": "text/html"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.NEUTRAL = [base + "/neutral"]
        now = time.time()
        incident = {
            "last_run": now - 60,
            "components": {
                "site": {
                    "down_since": now - probe.ALERT_AFTER - 5,
                    "last_seen": now - 60,
                    "texted": False,
                    "would_texted": True,
                    "last_detail": "HTTP 500",
                    "ref": "outside-probe:site:11",
                }
            },
        }
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            Path(state).write_text(json.dumps(incident))
            probe.CHECKS = [("site", base + "/down", 200, "html")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertEqual(len(calls), 1)
            self.assertIn("down", calls[0])
            self.assertNotIn("recovered", calls[0])
            self.assertEqual(payload["events"][0]["event"], "texted")
            self.assertTrue(json.loads(Path(state).read_text())["components"]["site"]["texted"])

        calls.clear()

        def forbid(message):
            raise AssertionError(message)

        probe.send_text = forbid
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            Path(state).write_text(json.dumps(incident))
            probe.CHECKS = [("site", base + "/up", 200, "html")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 0)
            self.assertEqual(calls, [])
            kinds = [event["event"] for event in payload["events"]]
            self.assertEqual(kinds, ["recovered"])
            self.assertFalse(payload["events"][0]["would_text_recovery"])
            self.assertFalse(payload["events"][0]["texted_recovery"])
            self.assertEqual(json.loads(Path(state).read_text())["components"], {})

    def test_ten_minute_clock_survives_partial_runs(self):
        calls = []

        def fake_send(message):
            saved = json.loads(Path(state).read_text())
            self.assertTrue(saved["components"]["site"]["texted"])
            calls.append(message)
            return True, "telnyx HTTP 200"

        probe.send_text = fake_send
        self.enable_alerts()
        base = self.serve({
            "/down": {"code": 500, "body": "no"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.CHECKS = [("site", base + "/down", 200, "html")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            now = time.time()
            Path(state).write_text(json.dumps({
                "last_run": now - 120,
                "components": {
                    "site": {
                        "down_since": now - (11 * 60),
                        "last_seen": now - 120,
                        "texted": False,
                        "last_detail": "HTTP 500",
                        "ref": "outside-probe:site:12",
                    }
                },
            }))
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertEqual([event["event"] for event in payload["events"]], ["texted"])
            self.assertEqual(len(calls), 1)
            self.assertNotIn("continuity_reset", [event["event"] for event in payload["events"]])

    def test_unobserved_gap_does_not_count_as_continuous(self):
        def forbid(message):
            raise AssertionError(message)

        probe.send_text = forbid
        self.enable_alerts()
        base = self.serve({
            "/down": {"code": 500, "body": "no"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.CHECKS = [("site", base + "/down", 200, "html")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            now = time.time()
            opened = now - 30 * 60
            Path(state).write_text(json.dumps({
                "last_run": opened,
                "components": {
                    "site": {
                        "down_since": opened,
                        "last_seen": opened,
                        "texted": False,
                        "last_detail": "HTTP 500",
                        "ref": "outside-probe:site:13",
                    }
                },
            }))
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertEqual([event["event"] for event in payload["events"]], ["continuity_reset"])
            saved = json.loads(Path(state).read_text())
            current = saved["components"]["site"]
            self.assertFalse(current["texted"])
            self.assertEqual(current["down_since"], opened)
            self.assertGreater(current["continuous_since"], opened)
            self.assertLess(abs(current["continuous_since"] - time.time()), 30)
            self.assertEqual(current["ref"], "outside-probe:site:13")

            current["continuous_since"] = time.time() - (11 * 60)
            current["last_seen"] = time.time() - 60
            Path(state).write_text(json.dumps(saved))
            calls = []

            def ok_send(message):
                calls.append(message)
                return True, "telnyx HTTP 200"

            probe.send_text = ok_send
            os.environ["TELNYX_API_KEY"] = "TELNYXTESTKEY123456"
            os.environ["OWNER_PHONE"] = "+15555550123"
            os.environ["FROM_NUMBER"] = "+15555550999"
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertEqual(len(calls), 1)
            shown = f"{(time.time() - opened) / 60:.0f}"
            self.assertGreaterEqual(int(shown), 30)
            self.assertIn(f"down {shown} min", calls[0])
            self.assertEqual(
                json.loads(Path(state).read_text())["components"]["site"]["down_since"],
                opened,
            )

    def test_vantage_down_does_not_reset_continuity(self):
        probe.CHECKS = [("site", "http://127.0.0.1:1/", 200, "html")]
        probe.NEUTRAL = ["http://127.0.0.1:1/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            now = time.time()
            opened = now - 3 * 3600
            Path(state).write_text(json.dumps({
                "last_run": opened,
                "components": {
                    "site": {
                        "down_since": opened,
                        "last_seen": opened,
                        "texted": False,
                        "last_detail": "x",
                        "ref": "outside-probe:site:14",
                    }
                },
            }))
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 3)
            self.assertEqual([event["event"] for event in payload["events"]], ["vantage_down"])
            saved = json.loads(Path(state).read_text())
            self.assertEqual(saved["components"]["site"]["down_since"], opened)

    def test_hb_503_ok_false_is_log_only(self):
        epoch = 1_700_000_000
        fresh = formatdate(epoch + 30, usegmt=True)
        base = self.serve({
            "/owned": {
                "code": 503,
                "date": fresh,
                "ctype": "application/json",
                "body": json.dumps({"ok": False, "epoch": epoch, "failing": ["disk"]}),
            },
            "/bare": {
                "code": 503,
                "ctype": "application/json",
                "body": json.dumps({"ok": False, "failing": ["disk"]}),
            },
            "/down": {"code": 503, "body": "unavailable"},
            "/neutral": {"code": 204, "body": ""},
        })
        status, detail = probe.check_once("api_hb", base + "/owned", 200, "hb")
        self.assertEqual(status, "droplet_owns", detail)
        self.assertIn("droplet ok: false", detail)
        status, detail = probe.check_once("api_hb", base + "/bare", 200, "hb")
        self.assertEqual(status, "down", detail)
        status, detail = probe.check_once("api_hb", base + "/down", 200, "hb")
        self.assertEqual(status, "down", detail)

        probe.CHECKS = [("api_hb", base + "/owned", 200, "hb")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 0)
            self.assertEqual(payload["events"][0]["event"], "droplet_owns")
            self.assertEqual(json.loads(Path(state).read_text())["components"], {})
            self.assertNotIn("| OPEN |", Path(log).read_text())

    def test_hb_recovery_mentions_droplet_ok(self):
        calls = []

        def fake_send(message):
            calls.append(message)
            return True, "telnyx HTTP 200"

        probe.send_text = fake_send
        self.enable_alerts()
        epoch = 1_700_000_000
        fresh = formatdate(epoch + 30, usegmt=True)
        base = self.serve({
            "/ok": {
                "code": 200,
                "date": fresh,
                "ctype": "application/json",
                "body": json.dumps({"ok": True, "epoch": epoch}),
            },
            "/owned": {
                "code": 503,
                "date": fresh,
                "ctype": "application/json",
                "body": json.dumps({"ok": False, "epoch": epoch, "failing": ["disk"]}),
            },
            "/neutral": {"code": 204, "body": ""},
        })
        probe.NEUTRAL = [base + "/neutral"]
        now = time.time()

        def seed(path):
            Path(path).write_text(json.dumps({
                "last_run": now - 60,
                "components": {
                    "api_hb": {
                        "down_since": now - 700,
                        "last_seen": now - 60,
                        "texted": True,
                        "last_detail": "HTTP 500",
                        "ref": "outside-probe:api_hb:8",
                    }
                },
            }))

        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            seed(state)
            probe.CHECKS = [("api_hb", base + "/ok", 200, "hb")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 0, payload)
            self.assertEqual(len(calls), 1)
            self.assertIn("droplet ok: true", calls[0])
            self.assertIn("recovered", calls[0])
            self.assertIn("droplet ok: true", Path(log).read_text())

            calls.clear()
            seed(state)
            probe.CHECKS = [("api_hb", base + "/owned", 200, "hb")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 0, payload)
            self.assertEqual(len(calls), 1)
            self.assertIn("standing down", calls[0])
            self.assertIn("droplet ok: false", calls[0])
            self.assertIn("droplet ok: false", Path(log).read_text())

    def test_alerts_enabled_must_be_exact_true(self):
        for value in ("True", " true ", "1", "TRUE", "yes"):
            os.environ["ALERTS_ENABLED"] = value
            self.assertFalse(probe.alerts_enabled(), value)
        os.environ["ALERTS_ENABLED"] = "true"
        self.assertTrue(probe.alerts_enabled())
        os.environ.pop("ALERTS_ENABLED")
        self.assertFalse(probe.alerts_enabled())

        os.environ["ALERTS_ENABLED"] = "True"
        base = self.serve({
            "/down": {"code": 500, "body": "no"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.CHECKS = [("site", base + "/down", 200, "html")]
        probe.NEUTRAL = [base + "/neutral"]

        def forbid(message):
            raise AssertionError(message)

        probe.send_text = forbid
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            now = time.time()
            Path(state).write_text(json.dumps({
                "components": {
                    "site": {
                        "down_since": now - probe.ALERT_AFTER - 5,
                        "last_seen": now - 60,
                        "texted": False,
                        "last_detail": "HTTP 500",
                        "ref": "outside-probe:site:15",
                    }
                },
            }))
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertTrue(payload["log_only"])
            self.assertEqual(payload["events"][0]["event"], "would_text")
            saved = json.loads(Path(state).read_text())
            self.assertFalse(saved["components"]["site"]["texted"])
            self.assertTrue(saved["components"]["site"]["would_texted"])

    def test_redact_hides_ghs_tokens(self):
        text = probe.redact("token ghs_abcdefghijklmnopqrstuvwxyz leaked")
        self.assertNotIn("ghs_", text)
        self.assertIn("[redacted]", text)

    def test_persist_failure_fails_a_healthy_run(self):
        os.environ["PROBE_AFTER_SAVE"] = "bash -c 'exit 1'"
        base = self.serve({
            "/up": {"code": 200, "body": "ok", "ctype": "text/html"},
            "/down": {"code": 500, "body": "no"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            probe.CHECKS = [("site", base + "/up", 200, "html")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 1)
            self.assertTrue(payload["ok"])
            self.assertEqual(payload["events"], [])

            probe.PERSIST_FAILED = False
            probe.CHECKS = [("site", base + "/down", 200, "html")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertFalse(payload["ok"])

    def test_usage_exits_1(self):
        buf = StringIO()
        with redirect_stdout(buf):
            code = probe.main([])
        self.assertEqual(code, 1)
        self.assertIn("usage", buf.getvalue())

        proc = subprocess.run(
            [sys.executable, str(Path(__file__).resolve().with_name("outside_probe.py"))],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(proc.returncode, 1)
        self.assertIn("usage", proc.stdout)

        proc = subprocess.run(
            [
                sys.executable,
                str(Path(__file__).resolve().with_name("outside_probe.py")),
                "--rechecks",
                "nope",
                "--state",
                "/tmp/ignored.json",
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(proc.returncode, 1)
        self.assertIn("usage", proc.stdout)

    def test_stale_ok_false_is_down(self):
        epoch = 1_700_000_000
        stale = formatdate(epoch + 20 * 60, usegmt=True)
        fresh = formatdate(epoch + 30, usegmt=True)
        body = json.dumps({"ok": False, "epoch": epoch, "failing": ["disk"]})
        base = self.serve({
            "/stale": {"code": 200, "date": stale, "ctype": "application/json", "body": body},
            "/stale503": {"code": 503, "date": stale, "ctype": "application/json", "body": body},
            "/fresh503": {"code": 503, "date": fresh, "ctype": "application/json", "body": body},
            "/neutral": {"code": 204, "body": ""},
        })
        status, detail = probe.check_once("api_hb", base + "/stale", 200, "hb")
        self.assertEqual(status, "down", detail)
        self.assertIn("stale", detail)
        self.assertIn("droplet ok: false", detail)
        status, detail = probe.check_once("api_hb", base + "/stale503", 200, "hb")
        self.assertEqual(status, "down", detail)
        self.assertIn("stale", detail)
        status, detail = probe.check_once("api_hb", base + "/fresh503", 200, "hb")
        self.assertEqual(status, "droplet_owns", detail)

        probe.CHECKS = [("api_hb", base + "/stale", 200, "hb")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertEqual(payload["events"][0]["event"], "opened")
            self.assertIn("api_hb", json.loads(Path(state).read_text())["components"])
            self.assertIn("| OPEN |", Path(log).read_text())

    def test_missing_telnyx_secrets_do_not_claim_the_text(self):
        def forbid(message):
            raise AssertionError(message)

        probe.send_text = forbid
        os.environ["ALERTS_ENABLED"] = "true"
        os.environ["TELNYX_API_KEY"] = "TELNYXTESTKEY123456"
        base = self.serve({
            "/down": {"code": 500, "body": "no"},
            "/up": {"code": 200, "body": "ok", "ctype": "text/html"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.NEUTRAL = [base + "/neutral"]
        now = time.time()
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            Path(state).write_text(json.dumps({
                "components": {
                    "site": {
                        "down_since": now - probe.ALERT_AFTER - 5,
                        "last_seen": now - 60,
                        "texted": False,
                        "last_detail": "HTTP 500",
                        "ref": "outside-probe:site:16",
                    }
                },
            }))
            probe.CHECKS = [("site", base + "/down", 200, "html")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertEqual(payload["events"][0]["event"], "text_failed")
            self.assertIn("missing", payload["events"][0]["detail"])
            saved = json.loads(Path(state).read_text())
            self.assertFalse(saved["components"]["site"]["texted"])

            calls = []

            def ok_send(message):
                calls.append(message)
                return True, "telnyx HTTP 200"

            probe.send_text = ok_send
            os.environ["OWNER_PHONE"] = "+15555550123"
            os.environ["FROM_NUMBER"] = "+15555550999"
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertEqual(len(calls), 1)
            self.assertIn("down", calls[0])
            self.assertTrue(json.loads(Path(state).read_text())["components"]["site"]["texted"])

            calls.clear()
            probe.send_text = forbid
            os.environ.pop("OWNER_PHONE")
            probe.CHECKS = [("site", base + "/up", 200, "html")]
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 2)
            self.assertEqual(payload["events"][0]["event"], "recovery_text_failed")
            saved = json.loads(Path(state).read_text())
            self.assertIn("site", saved["components"])
            self.assertNotIn("recovery_sent", saved["components"]["site"])

            probe.send_text = ok_send
            os.environ["OWNER_PHONE"] = "+15555550123"
            code, payload = self.run_probe(state, log)
            self.assertEqual(code, 0)
            self.assertEqual(len(calls), 1)
            self.assertIn("recovered", calls[0])
            self.assertEqual(json.loads(Path(state).read_text())["components"], {})

    def test_persist_hook_stdout_goes_to_stderr(self):
        os.environ["PROBE_AFTER_SAVE"] = "bash -c 'echo probe-state-hook-stdout'"
        base = self.serve({
            "/up": {"code": 200, "body": "ok", "ctype": "text/html"},
            "/neutral": {"code": 204, "body": ""},
        })
        probe.CHECKS = [("site", base + "/up", 200, "html")]
        probe.NEUTRAL = [base + "/neutral"]
        with tempfile.TemporaryDirectory() as tmp:
            state = str(Path(tmp) / "state.json")
            log = str(Path(tmp) / "OUTAGE-LOG.md")
            out = StringIO()
            err = StringIO()
            with redirect_stdout(out), redirect_stderr(err):
                code = probe.main([
                    "--state", state,
                    "--log", log,
                    "--rechecks", "0",
                    "--retry-wait", "0",
                ])
            self.assertEqual(code, 0)
            self.assertNotIn("probe-state-hook-stdout", out.getvalue())
            self.assertIn("probe-state-hook-stdout", err.getvalue())
            payload = json.loads(out.getvalue())
            self.assertTrue(payload["ok"])

    def test_probe_state_skips_pending_recovery_and_cleans_temps(self):
        script = Path(__file__).resolve().with_name("git_state.sh")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            bare = root / "bare.git"
            work = root / "work"
            state = root / "state"
            scratch = root / "scratch"
            scratch.mkdir()
            subprocess.run(["git", "init", "--bare", str(bare)], check=True, capture_output=True)
            subprocess.run(
                ["git", "-c", "init.defaultBranch=main", "init", str(work)],
                check=True,
                capture_output=True,
            )
            subprocess.run(
                ["git", "-C", str(work), "remote", "add", "origin", str(bare)],
                check=True,
                capture_output=True,
            )
            (work / ".names").write_text("keep\n")
            (work / ".want").write_text("keep\n")
            state.mkdir()
            (state / "state.json").write_text(
                '{"pending_recovery": {"site": true}, "components": {}}\n'
            )
            (state / "OUTAGE-LOG.md").write_text(probe.LOG_HEADER)
            env = os.environ.copy()
            env["GITHUB_WORKSPACE"] = str(work)
            env["TMPDIR"] = str(scratch)
            env["PROBE_STATE_REMOTE"] = "origin"

            def persist():
                return subprocess.run(
                    ["bash", str(script), "persist", str(state)],
                    check=False,
                    capture_output=True,
                    text=True,
                    env=env,
                )

            skipped = persist()
            self.assertEqual(skipped.returncode, 0, skipped.stderr)
            self.assertIn("probe state unchanged", skipped.stdout)
            self.assertEqual(list(scratch.iterdir()), [])
            self.assertEqual((work / ".names").read_text(), "keep\n")
            self.assertEqual((work / ".want").read_text(), "keep\n")
            refs = subprocess.run(
                ["git", "-C", str(bare), "show-ref"],
                capture_output=True,
                text=True,
                check=False,
            )
            self.assertNotIn("probe-state", refs.stdout)

            (state / "state.json").write_text(
                '{"components": {"site": {"down_since": 10, "last_seen": 10, "texted": false}}}\n'
            )
            (state / "OUTAGE-LOG.md").write_text(
                probe.LOG_HEADER + "| 2026-01-01 00:00 | OPEN | ongoing | outside: site | x | (open) | r |\n"
            )
            committed = persist()
            self.assertEqual(committed.returncode, 0, committed.stderr)
            self.assertNotIn("unchanged", committed.stdout)
            self.assertEqual(list(scratch.iterdir()), [])
            again = persist()
            self.assertEqual(again.returncode, 0, again.stderr)
            self.assertIn("probe state unchanged", again.stdout)
            self.assertEqual(list(scratch.iterdir()), [])
            self.assertEqual((work / ".names").read_text(), "keep\n")
            self.assertIn(
                "probe-state",
                subprocess.run(
                    ["git", "-C", str(bare), "show-ref"],
                    capture_output=True,
                    text=True,
                    check=True,
                ).stdout,
            )

    def test_parse_http_date(self):
        stamp = probe.parse_http_date("Sun, 09 Sep 2001 01:46:40 GMT")
        self.assertEqual(int(stamp), 1_000_000_000)
        self.assertIsNone(probe.parse_http_date(""))
        self.assertIsNone(probe.parse_http_date("not-a-date"))


if __name__ == "__main__":
    unittest.main()
