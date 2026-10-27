# Verification and limitations

## Local measurements before source publication

Environment: Apple Silicon macOS, Docker Desktop, container limited to 1 GiB / 2 CPUs. A small `mynet.cpn` example was validated, initialized and advanced eight times, using a new container for each run. Two baseline `modern` runs and two final `optimized` runs were compared. `docs/benchmark.json` also retains two intermediate optimized runs; the final setting is represented by its last two entries.

| Mean metric | Baseline | Final tuning |
|---|---:|---:|
| Container memory after eight transitions | 246.15 MiB | 234.65 MiB |
| Server ready | 2.494 s | 2.442 s |
| Validation | 4.936 s | 4.928 s |
| Simulator initialization | 1.168 s | 1.165 s |
| Eight transitions / API requests | 0.084 s | 0.076 s |

This small sample does not establish a meaningful computation-speed improvement. Memory varies by workload and GC timing; it excludes the Docker VM and browser. Large models were not profiled. A smaller free-heap target can cause more frequent GC; maximum Java heap remains 512 MiB.

The prior main JS asset was 1,777,954 bytes uncompressed and 413,868 bytes with gzip. This demonstrates transport compression, not an equivalent reduction in disk size or JavaScript execution time. A clean source rebuild can produce different bundles.

Earlier local browser checks: 320 px and 615 px command layout, Project/Inspector drawers and Escape, keyboard tab activation, model validation, start simulation, transition firing with token movement, browser `.cpn` download followed by XML parsing. Text colors and control boundaries were contrast-checked; this was not a complete WCAG conformance audit. Full diagram keyboard operation, screen-reader use, every dialog/report and large user models remain outside that scope.

## Source distribution checks

Run `./scripts/build.sh` for a clean source build, then `docker compose up -d`. Run `python3 scripts/verify-runtime.py` for model validation and a real transition. The test uses its own API session; repeat tests can leave simulator sessions until the container is restarted. The GitHub workflow performs these build/API checks on Linux amd64 when enabled; it does not automate the visual UI checks or publish an image.

For HTTP compression, inspect a rebuilt bundle URL from the browser Network panel and request it with `Accept-Encoding: gzip`; expect `Content-Encoding: gzip` on eligible large text responses. No static resource cache lifetime is increased, avoiding stale app files across rebuilds.

Source publication build and runtime results are recorded in `docs/source-build-verification.json` after local verification. A local pass and a GitHub Actions pass are separate results; do not infer a CI pass from the existence of the workflow.
