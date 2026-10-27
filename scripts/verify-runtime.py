#!/usr/bin/env python3
"""Validate a bundled example and fire one transition in a separate API session."""
import argparse
import json
from pathlib import Path
import time
import urllib.request
import urllib.error
import http.client

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--url', default='http://127.0.0.1:18736')
parser.add_argument('--model', type=Path, default=Path(__file__).resolve().parents[1] /
                    'sample-cpn-models/DiningPhilosophers/DiningPhilosophers.cpn')
args = parser.parse_args()
session = 'runtime-verification-' + str(time.time_ns())
base = args.url.rstrip('/') + '/api/v2/cpn'

def call(path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(base + path, data=data, headers={
        'Content-Type': 'application/json', 'X-SessionId': session})
    with urllib.request.urlopen(request, timeout=90) as response:
        return json.load(response)

# Wait only on the idempotent readiness request, never retry model mutations.
deadline = time.monotonic() + 90
while True:
    try:
        with urllib.request.urlopen(args.url.rstrip('/') + '/', timeout=2) as response:
            response.read(1)
        break
    except (urllib.error.URLError, http.client.HTTPException, TimeoutError):
        if time.monotonic() >= deadline:
            raise SystemExit('Server did not become ready within 90 seconds.')
        time.sleep(0.2)

xml = args.model.read_text(encoding='iso8859-1')
initialized = call('/init', {'xml': xml, 'complex_verify': True, 'need_sim_restart': False})
if not initialized.get('success', initialized.get('isSuccess')):
    raise SystemExit('Model validation failed: ' + json.dumps(initialized))
call('/sim/init', {'options': {}})
before = call('/sim/state')
enabled = call('/sim/transitions/enabled')
if not enabled:
    raise SystemExit('The test model has no enabled transition.')
call('/sim/step/' + enabled[0])
after = call('/sim/state')
if after['step'] != before['step'] + 1:
    raise SystemExit('The simulation step did not advance.')
print(json.dumps({'validation': initialized, 'before': before, 'after': after}, indent=2))
print('PASS: model validated and one transition fired.')
