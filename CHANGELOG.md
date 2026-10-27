# Changelog

## 2026-10-27 — modified Docker distribution

Changes relative to upstream `38b72b8f067bb454ab2bf873cb0d9bca1f1f9a1b`, organized as feature commits:

- **Docker:** build Angular and the Spring Boot JAR from source; package Java 8 and i386 libc; use a non-root process, loopback port, resource limits, executable tmpfs and archived report volume. Replace fixed API origins with the current browser origin. Keep ViewEngine for the legacy frontend.
- **Saving:** check the actual Electron filesystem method before using it, preserving browser downloads as the fallback. Fix lives in TypeScript rather than minified JavaScript.
- **UI:** improve toolbar, buttons, tabs, fields, console and focus styling; add responsive drawers and step/time display; add keyboard tab navigation and action names. Do not change the simulator algorithms, model coordinates or model object colors.
- **Performance:** enable response compression; adjust Java initial heap/GC settings; avoid presentation redecoration for SVG, console and editor changes. Do not claim the inactive Tomcat settings from an early local experiment affect Jetty.
- **Launcher:** provide a repository-relative macOS/Linux launch script and Git-revision-aware build helper.
- **Licensing:** retain upstream AGPL text/history, add visible source and license access and English attribution/redistribution notes. No prebuilt image publication.
- **Build repair:** synchronize upstream's npm lockfile, which was missing the declared `path` package and related entries, so `npm ci` can build from a clean checkout.
- **Verification:** add syntax checks, a genuine model validation/transition test and an optional CI workflow.
- **Documentation:** provide English setup/use/storage/backup/update/rollback guidance, implementation notes, measurements and component-license limitations.

Upstream commits remain in the repository history with their original authorship.
