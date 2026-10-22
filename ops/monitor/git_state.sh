#!/usr/bin/env bash
# Restore or persist outside-probe state on a dedicated branch.
# The branch holds state.json and OUTAGE-LOG.md only. It is not merged to main.
#
#   git_state.sh restore DIR
#   git_state.sh persist DIR
#
# A commit is created only when an incident is open or the outage record
# changed. A healthy run that only refreshes last_run does not commit, and
# the first healthy run does not create the branch.
#
# The first commit is a root commit (commit-tree, no parent). Later commits
# parent the previous tip and are pushed without force. No worktree is used.
#
# PROBE_STATE_BRANCH  default: probe-state
# PROBE_STATE_REMOTE  default: origin
# Run inside a checkout that can fetch and push that remote (Actions does).
set -euo pipefail

cmd=${1:?usage: git_state.sh restore|persist DIR}
dir=${2:?usage: git_state.sh restore|persist DIR}
branch=${PROBE_STATE_BRANCH:-probe-state}
remote=${PROBE_STATE_REMOTE:-origin}

if [[ -n "${GITHUB_WORKSPACE:-}" ]]; then
  cd "$GITHUB_WORKSPACE"
fi

export GIT_TERMINAL_PROMPT=0

if [[ "$branch" == "main" || "$branch" == "master" ]]; then
  echo "refusing to store probe state on ${branch}" >&2
  exit 1
fi
if [[ ! "$branch" =~ ^[A-Za-z0-9._/-]+$ ]]; then
  echo "invalid probe state branch name" >&2
  exit 1
fi

fail_persist() {
  echo "::error::probe state persist failed" >&2
  if [[ $# -gt 0 ]]; then
    printf '%s\n' "$*" >&2
  fi
  exit 1
}

redact_stream() {
  sed -E \
    -e 's#x-access-token:[^@[:space:]]+#x-access-token:[redacted]#g' \
    -e 's#(ghp_|gho_|ghs_|github_pat_|glpat-)[A-Za-z0-9_]+#[redacted]#g'
}

# 0 = branch exists, 2 = branch is absent, 1 = fetch failed.
# Callers must use `if fetch_state_branch; then` so a missing branch does not abort.
fetch_state_branch() {
  local err
  err=$(mktemp)
  if git fetch --depth=1 --no-tags "$remote" \
    "+refs/heads/${branch}:refs/remotes/${remote}/${branch}" 2>"$err"; then
    rm -f "$err"
    return 0
  fi
  if grep -Eq "couldn't find remote ref|Could not find remote branch|Remote branch .+ not found" "$err"; then
    rm -f "$err"
    return 2
  fi
  redact_stream <"$err" >&2 || true
  rm -f "$err"
  return 1
}

restore_state() {
  local frc=0 tree
  mkdir -p "$dir"
  if fetch_state_branch; then
    frc=0
  else
    frc=$?
  fi
  if [[ "$frc" -eq 1 ]]; then
    echo "failed to fetch ${remote} ${branch}" >&2
    exit 1
  fi
  if [[ "$frc" -eq 0 ]]; then
    tree="${remote}/${branch}"
    if git cat-file -e "${tree}:state.json" 2>/dev/null; then
      git show "${tree}:state.json" >"${dir}/state.json"
    else
      echo '{}' >"${dir}/state.json"
    fi
    if git cat-file -e "${tree}:OUTAGE-LOG.md" 2>/dev/null; then
      git show "${tree}:OUTAGE-LOG.md" >"${dir}/OUTAGE-LOG.md"
    fi
  else
    echo '{}' >"${dir}/state.json"
  fi
}

# Print commit or skip. Ignores last_run and last_vantage_down.
# Header-only and missing logs compare equal.
decide_commit() {
  local prev_state=$1 prev_log=$2
  PROBE_PREV_STATE="$prev_state" \
  PROBE_PREV_LOG="$prev_log" \
  PROBE_NEW_STATE="${dir}/state.json" \
  PROBE_NEW_LOG="${dir}/OUTAGE-LOG.md" \
  python3 - <<'PY'
import json
import os

def load_state(path):
    if not path:
        return {}
    try:
        with open(path) as handle:
            data = json.load(handle)
    except (OSError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}

def log_rows(path):
    if not path:
        return []
    try:
        text = open(path).read()
    except OSError:
        return []
    rows = []
    for line in text.splitlines():
        if not line.startswith("|"):
            continue
        if line.startswith("| ---") or "start (MT)" in line:
            continue
        rows.append(line)
    return rows

def incident_open(state):
    comps = state.get("components")
    if not isinstance(comps, dict):
        return False
    return any(isinstance(item, dict) and "down_since" in item for item in comps.values())

def meaningful(state):
    out = {}
    comps = state.get("components")
    if isinstance(comps, dict) and comps:
        out["components"] = comps
    pending = state.get("pending_recovery")
    if isinstance(pending, dict) and pending:
        out["pending_recovery"] = pending
    return out

prev = load_state(os.environ.get("PROBE_PREV_STATE", ""))
new = load_state(os.environ.get("PROBE_NEW_STATE", ""))
changed = meaningful(new) != meaningful(prev) or log_rows(os.environ.get("PROBE_NEW_LOG", "")) != log_rows(os.environ.get("PROBE_PREV_LOG", ""))
if incident_open(new) or changed:
    print("commit")
else:
    print("skip")
PY
}

persist_state() {
  local frc have=0 parent="" prev_dir="" prev_state="" prev_log=""
  local decision index_file meta sha err push_rc
  [[ -f "${dir}/state.json" ]] || fail_persist "missing ${dir}/state.json"
  [[ -f "${dir}/OUTAGE-LOG.md" ]] || fail_persist "missing ${dir}/OUTAGE-LOG.md"
  if ! python3 -c 'import json,sys; json.load(open(sys.argv[1]))' "${dir}/state.json"; then
    fail_persist "state.json is not valid JSON"
  fi

  if fetch_state_branch; then
    frc=0
  else
    frc=$?
  fi
  if [[ "$frc" -eq 1 ]]; then
    fail_persist "failed to fetch ${remote} ${branch}"
  fi
  if [[ "$frc" -eq 0 ]]; then
    have=1
    parent=$(git rev-parse "${remote}/${branch}")
    prev_dir=$(mktemp -d)
    if git cat-file -e "${remote}/${branch}:state.json" 2>/dev/null; then
      git show "${remote}/${branch}:state.json" >"${prev_dir}/state.json"
      prev_state="${prev_dir}/state.json"
    fi
    if git cat-file -e "${remote}/${branch}:OUTAGE-LOG.md" 2>/dev/null; then
      git show "${remote}/${branch}:OUTAGE-LOG.md" >"${prev_dir}/OUTAGE-LOG.md"
      prev_log="${prev_dir}/OUTAGE-LOG.md"
    fi
  fi

  cleanup() {
    rm -f "${index_file:-}" "${meta:-}" "${meta:-}.names" "${meta:-}.want" "${err:-}"
    rm -rf "${prev_dir:-}"
  }
  trap cleanup EXIT

  decision=$(decide_commit "$prev_state" "$prev_log")
  if [[ "$decision" != "commit" ]]; then
    echo "probe state unchanged"
    exit 0
  fi

  index_file=$(mktemp)
  meta=$(mktemp)
  rm -f "$index_file"
  # Private index. commit-tree does not touch the checkout or a worktree.
  if ! (
    set -euo pipefail
    export GIT_INDEX_FILE="$index_file"
    export GIT_AUTHOR_NAME="github-actions[bot]"
    export GIT_AUTHOR_EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
    export GIT_COMMITTER_NAME="github-actions[bot]"
    export GIT_COMMITTER_EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
    state_blob=$(git hash-object -w "${dir}/state.json")
    log_blob=$(git hash-object -w "${dir}/OUTAGE-LOG.md")
    git update-index --add --cacheinfo "100644,${state_blob},state.json"
    git update-index --add --cacheinfo "100644,${log_blob},OUTAGE-LOG.md"
    tree=$(git write-tree)
    git ls-tree -r --name-only "$tree" | sort >"${meta}.names"
    printf '%s\n' OUTAGE-LOG.md state.json | sort >"${meta}.want"
    if ! cmp -s "${meta}.names" "${meta}.want"; then
      echo "refusing to commit unexpected probe-state tree" >&2
      exit 1
    fi
    if [[ -n "$parent" ]]; then
      old_tree=$(git rev-parse "${parent}^{tree}")
      if [[ "$old_tree" == "$tree" ]]; then
        echo skip >"$meta"
        exit 0
      fi
      sha=$(git commit-tree "$tree" -p "$parent" -m "chore: record outside probe state")
    else
      sha=$(git commit-tree "$tree" -m "chore: record outside probe state")
    fi
    printf '%s\n' "$sha" >"$meta"
  ); then
    fail_persist
  fi

  sha=$(head -n 1 "$meta")
  if [[ "$sha" == "skip" || -z "$sha" ]]; then
    echo "probe state unchanged"
    exit 0
  fi

  err=$(mktemp)
  set +e
  git push "$remote" "${sha}:refs/heads/${branch}" 2>"$err"
  push_rc=$?
  set -e
  if [[ "$push_rc" -ne 0 ]]; then
    redact_stream <"$err" >&2 || true
    fail_persist
  fi
}

case "$cmd" in
  restore) restore_state ;;
  persist) persist_state ;;
  *)
    echo "usage: git_state.sh restore|persist DIR" >&2
    exit 1
    ;;
esac
