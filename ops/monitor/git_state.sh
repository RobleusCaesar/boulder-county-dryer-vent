#!/usr/bin/env bash
# Restore or persist outside-probe state on a dedicated branch.
# The branch holds state.json and OUTAGE-LOG.md only. It is not merged to main.
#
#   git_state.sh restore DIR
#   git_state.sh persist DIR
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

redact_stream() {
  sed -E \
    -e 's#x-access-token:[^@[:space:]]+#x-access-token:[redacted]#g' \
    -e 's#(ghp_|gho_|github_pat_|glpat-)[A-Za-z0-9_]+#[redacted]#g'
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

tracked_tree_is_state_only() {
  local path
  local -a tracked=()
  mapfile -t tracked < <(git -C "$1" ls-files)
  if [[ "${#tracked[@]}" -eq 0 ]]; then
    echo "refusing to commit an empty probe-state tree" >&2
    return 1
  fi
  for path in "${tracked[@]}"; do
    case "$path" in
      state.json|OUTAGE-LOG.md) ;;
      *)
        echo "refusing to commit unexpected path on ${branch}: ${path}" >&2
        return 1
        ;;
    esac
  done
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

persist_state() {
  local frc wt have=0
  [[ -f "${dir}/state.json" ]] || { echo "missing ${dir}/state.json" >&2; exit 1; }
  [[ -f "${dir}/OUTAGE-LOG.md" ]] || { echo "missing ${dir}/OUTAGE-LOG.md" >&2; exit 1; }
  python3 -c 'import json,sys; json.load(open(sys.argv[1]))' "${dir}/state.json"

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
    have=1
  fi

  wt=$(mktemp -d)
  cleanup() {
    if [[ -n "${wt:-}" ]]; then
      git worktree remove --force "$wt" >/dev/null 2>&1 || rm -rf "$wt"
      git worktree prune >/dev/null 2>&1 || true
    fi
  }
  trap cleanup EXIT

  if [[ "$have" -eq 1 ]]; then
    git worktree add --detach "$wt" "${remote}/${branch}"
  else
    git worktree add --detach "$wt" HEAD
    git -C "$wt" switch --orphan "$branch"
    git -C "$wt" read-tree --empty
    git -C "$wt" clean -fdq
  fi

  cp "${dir}/state.json" "${wt}/state.json"
  cp "${dir}/OUTAGE-LOG.md" "${wt}/OUTAGE-LOG.md"
  git -C "$wt" add -- state.json OUTAGE-LOG.md
  if git -C "$wt" diff --cached --quiet; then
    echo "probe state unchanged"
    exit 0
  fi
  tracked_tree_is_state_only "$wt"
  git -C "$wt" \
    -c user.name="github-actions[bot]" \
    -c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
    -c commit.gpgsign=false \
    commit -m "chore: record outside probe state"
  git -C "$wt" push "$remote" "HEAD:refs/heads/${branch}"
}

case "$cmd" in
  restore) restore_state ;;
  persist) persist_state ;;
  *)
    echo "usage: git_state.sh restore|persist DIR" >&2
    exit 1
    ;;
esac
