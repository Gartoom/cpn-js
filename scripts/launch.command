#!/bin/sh
# Modified distribution, 2026-10-27. AGPL-3.0; see LICENSE.
set -eu
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cpn_repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$cpn_repo_dir"
if [ "$(uname -s)" = Darwin ]; then open -g -a Docker; fi
cpn_attempt=0
until docker info >/dev/null 2>&1; do
  cpn_attempt=$((cpn_attempt + 1))
  if [ "$cpn_attempt" -ge 90 ]; then echo 'Docker did not become ready.' >&2; exit 1; fi
  sleep 1
done
docker compose up -d
cpn_port=${CPNIDE_PORT:-18736}
case "$cpn_port" in ''|*[!0-9]*) echo 'CPNIDE_PORT must be numeric.' >&2; exit 1;; esac
cpn_url="http://127.0.0.1:$cpn_port/"
cpn_attempt=0
until curl -fsS --max-time 2 "$cpn_url" >/dev/null 2>&1; do
  cpn_attempt=$((cpn_attempt + 1))
  if [ "$cpn_attempt" -ge 90 ]; then docker compose logs --tail 40; exit 1; fi
  sleep 1
done
if [ "$(uname -s)" = Darwin ]; then
  open "$cpn_url"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$cpn_url"
else
  echo "Open $cpn_url in your browser."
fi
