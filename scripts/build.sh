#!/bin/sh
# Modified distribution, 2026-10-27. AGPL-3.0; see LICENSE.
set -eu
cpn_repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$cpn_repo_dir"
CPN_SOURCE_REF=$(git rev-parse HEAD)
export CPN_SOURCE_REF
docker compose build "$@"
