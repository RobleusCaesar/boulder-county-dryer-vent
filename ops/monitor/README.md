# Outside uptime probe

A scheduled GitHub Actions check for Boulder County Dryer Vent. It runs on GitHub's runners, not on the droplet and not on any other monitor host.

The schedule starts only after this workflow is on the default branch. Until then, run it with **Actions → Uptime probe → Run workflow**.

## Checks

Redirects are not followed.

| Check | URL | Up when |
| --- | --- | --- |
| Main site | `https://bouldercountydryervent.com/` | HTTP 200 |
| Book page | `https://bouldercountydryervent.com/book/` | HTTP 200 |
| Book API | `https://api.bouldercountydryervent.com/book` | HTTP 200 and JSON `ok` is `true` |
| Heartbeat | `https://api.bouldercountydryervent.com/hb` | HTTP 200, JSON `ok` is `true`, and `epoch` (unix seconds) is under 15 minutes older than the response **Date** header |
| Sign-in | `https://sign.bouldercountydryervent.com/sign_in` | HTTP 200. A **302 is down** |

Heartbeat age uses the server `Date` header, not the runner clock. If `/hb` loads, the epoch is fresh, and `ok` is `false`, the probe only logs it. The droplet sends its own alert for that. A missing, stale, or unreachable heartbeat is this probe's outage.

Before judging, the probe GETs a neutral URL (Google's 204, then Cloudflare's trace). If those fail, it records no verdict and does not change open incidents.

## Outage rule

Each check is retried once. If it is still down, the run checks again at about **+5 minutes** and **+10 minutes** (GitHub's cron can start late). A text is sent only when the component has been down continuously for **10 minutes or more**.

State is stored on the branch `probe-state` (`state.json` and `OUTAGE-LOG.md`). One incident produces one down text and, if that text was sent, one recovery text. The workflow commits that branch as `github-actions[bot]`. Do not merge `probe-state` into `main`.

If the workflow does not run for more than 3 hours, an open incident is closed at the last observation and is not treated as one continuous outage. That avoids a second text when GitHub delays the schedule, and it does not pretend the probe watched a long gap.

## Log-only mode

This ships **log-only**. Texts are sent only when the repository Actions **variable** `ALERTS_ENABLED` is `true` (any other value, or an unset variable, is off).

Do not create secrets in git. When you want texts, add these **repository** Actions secrets (Settings → Secrets and variables → Actions). Environment secrets are not visible to this workflow.

| Secret | Purpose |
| --- | --- |
| `TELNYX_API_KEY` | Bearer token for `POST https://api.telnyx.com/v2/messages` |
| `OWNER_PHONE` | Destination number, E.164 |
| `FROM_NUMBER` | Telnyx sending number, E.164 |

The JSON body is `from`, `to`, and `text`. The probe never writes those values into the workflow log, the outage log, or `state.json`.

## Run locally

```bash
python3 ops/monitor/test_outside_probe.py
python3 ops/monitor/outside_probe.py --state /tmp/bcdv-probe.json --log /tmp/BCDV-OUTAGE-LOG.md
```

Exit `0` when nothing this probe owns is down, `2` when a component is still down, `3` when this vantage cannot reach the neutral sites, `1` on a bad invocation or an unexpected error. The workflow run is red for exits 2 and 3.

Leaving `ALERTS_ENABLED` unset keeps a local run log-only. Setting it to `true` in the environment, with the three secrets, sends real texts.
