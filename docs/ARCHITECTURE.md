# Architecture

The browser loads Angular assets from a Spring Boot 2.1.1 server with embedded **Jetty**. The UI sends model/validation/simulation requests to the same origin. Access/CPN bridges Java and the bundled SML simulator. Frontend and Java use the runtime image's native architecture; the bundled Linux simulator is 32-bit x86 and requires compatible execution/emulation.

The Docker build has frontend, backend, i386 libc and runtime stages. Backend assembly depends on frontend output so both large builds do not run simultaneously. A root Gradle settings file is generated inside the build container to build only `cpn-ide-back`; that module uses upstream's prebuilt local JAR dependencies. This does not rebuild every Access/CPN library or the native simulator.

Node 14 and Java 8 are compatibility choices. Angular's Ivy compiler is disabled and build optimizer is disabled as in the working legacy build. `npm ci` uses the corrected committed lockfile; package lifecycle scripts are disabled because Electron installation is not needed. Docker base tags and external Gradle artifacts are not all pinned to immutable digests, so this is a tested clean-build recipe, not a bit-for-bit reproducibility claim.

The final image contains a JRE, 32-bit libc, the combined JAR, the launch script and configuration. It runs as UID 1000, under Docker's init process. The Compose port binds to loopback only; it adds no authentication. Arbitrary CPN/ML models can execute model code: run trusted models and do not expose the service to untrusted users.

`/data` is executable tmpfs for the old directory-reading compatibility workaround. The script starts Java, periodically archives `/data/CPN_IDE` into `/store/reports.tar`, and traps TERM/INT for a final archive. No model-download folder from the host is mounted. Browser downloads and report archives are separate persistence paths.

The presentation layer consists of an appended CSS bundle and a small standalone JavaScript asset. It decorates existing controls and delegates to existing application events. The original tab control responds to `mousedown`, so keyboard activation dispatches that same event. The MutationObserver ignores SVG, console, code-editor and status mutations; ResizeObserver updates toolbar height for wrapped layouts. It is not a replacement for Angular state or the simulator.

The source build applies the saving fix to `main-toolbar.component.ts`. Earlier local experiments patched a compiled bundle; that compiled bundle is deliberately not copied into this fork. The Source / license page is generated from a readable HTML template, with `CPN_SOURCE_REF` supplied by scripts/build.sh. No private host paths, model backups or Docker volumes are part of the new repository files.
