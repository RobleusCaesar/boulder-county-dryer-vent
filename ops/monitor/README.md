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

Heartbeat age uses the server `Date` header, not the runner clock. A fresh `/hb` whose JSON says `ok: false` is log-only, including when the HTTP status is not 200 (a 503 with a fresh `ok: false` is log-only). Fresh means `epoch` is at most 15 minutes older than that Date header. The droplet sends its own alert for that. A stale `ok: false`, a missing or unreachable heartbeat, or a 503 that does not say `ok: false`, is this probe's outage.

Before judging, the probe GETs a neutral URL (Google's 204, then Cloudflare's trace). If those fail, it records no verdict and does not change open incidents.

## Outage rule

Each check is retried once. If it is still down, the run checks again at about **+5 minutes** and **+10 minutes** (GitHub's cron can start late). A text is sent only when the component has been down continuously for **10 minutes or more**.

The cron is `3-59/10 * * * *` (minutes 3, 13, 23, 33, 43, and 53).

State is stored on the branch `probe-state` (`state.json` and `OUTAGE-LOG.md`). One incident produces one down text and, if that down text was sent, one recovery text. A failed text is not sent again. If alerts are on but a Telnyx secret is missing, that run does not use up the incident's text; a later run that has the secrets can still send it. Turning alerts on in the middle of an outage sends the down text first; it does not send a recovery for a down text that never went out. A heartbeat recovery says whether the droplet reported `ok: true` or `ok: false`.

The workflow commits that branch as `github-actions[bot]` only when an incident is open or the outage record changed. A healthy run that only refreshes `last_run` does not commit, and the first healthy run does not create the branch. The first commit is a root commit. Do not merge `probe-state` into `main`.

If a component was last seen down more than 15 minutes ago, the 10-minute clock starts over and the incident stays open. Texts and the outage log keep the original start and the full length. A long gap still produces at most one down text and one recovery. Time the probe did not observe does not count toward the 10 minutes. A run that stops early still counts: the next run continues that clock when the last observation was within 15 minutes.

## Log-only mode

This ships **log-only**. Texts are sent only when the repository Actions **variable** `ALERTS_ENABLED` is exactly `true`. `True`, `1`, and surrounding spaces stay off. This workflow does not use a GitHub Actions environment, so it reads that repository variable rather than an environment-scoped one.

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

Unit tests also run in GitHub Actions on pull requests and on pushes other than `probe-state` (`.github/workflows/probe-tests.yml`). That workflow does not build or deploy the site.

Exit `0` when nothing this probe owns is down, `2` when a component is still down, `3` when this vantage cannot reach the neutral sites, `1` on a bad invocation, a failed state persist, or an unexpected error. The workflow run is red for exits 1, 2, and 3.

Leaving `ALERTS_ENABLED` unset keeps a local run log-only. Setting it to exactly `true` in the environment, with the three secrets, sends real texts.
