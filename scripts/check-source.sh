#!/bin/sh
# Run in the frontend build environment, where Node.js 14 is available.
set -eu
node --check cpn-ide-front/src/assets/modern/cpn-modern.js
sh -n docker/start.sh scripts/launch.command scripts/build.sh
python3 -m py_compile scripts/verify-runtime.py
