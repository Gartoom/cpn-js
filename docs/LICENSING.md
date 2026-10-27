# Licensing, attribution and source availability

This document explains the licensing information found for this modified distribution. The complete [GNU AGPL v3 text](../LICENSE) is authoritative for the covered program; this explanation does not amend it or replace any separate component license. The project is not public domain.

## Origin and changes

CPN IDE originates from [cpn-io/cpn-js](https://github.com/cpn-io/cpn-js) and [cpnide.org](https://cpnide.org/). The base revision is `38b72b8f067bb454ab2bf873cb0d9bca1f1f9a1b`, version 1.24.1031. Existing source headers and Git authorship are retained. The original frontend package identifies its author as TU/e. Some Access/CPN source headers credit AIS Group, Eindhoven University of Technology (2010–2011), and some engine classes credit Michael Westergaard and others (2004–2006); those notices are component-specific, not a new ownership claim for the whole project.

This fork's changes are dated 2026-10-27, summarized in [NOTICE.md](../NOTICE.md) and [CHANGELOG.md](../CHANGELOG.md), and identified by separate Git commits. Newly added covered source, scripts and documentation are offered under AGPL version 3. Original code, third-party material, names and logos retain their respective rights. The FSF notice in LICENSE concerns the license document, not authorship of CPN IDE. Nothing here grants trademark rights or implies upstream endorsement.

## AGPL conditions in practical terms

- **Use and private changes:** AGPL section 2 permits running and modifying covered works privately under its terms. Private local modifications do not by themselves require publication to the public. Commercial use and charging for permitted copies/services are not prohibited.
- **Unchanged source copies:** preserve the copyright, license and warranty notices and give recipients the license (section 4).
- **Modified source copies:** prominently identify modifications and their dates; preserve required notices; license the covered work as required by AGPL; display appropriate legal notices where section 5 requires them. The license distinguishes an independent aggregate from a combined covered work; do not assume merely putting files in one Docker image settles that distinction.
- **Executables / images:** if conveying a covered executable or an image containing it, comply with sections 5 and 6 and provide machine-readable Corresponding Source through a permitted method. A link to upstream alone does not provide your modifications. Corresponding Source includes the needed source and build/install/control scripts, subject to the license's definitions and exceptions. Section 6 can also require Installation Information for covered User Products.
- **Modified network services:** section 13 requires a prominent offer for every user interacting remotely with the modified program to receive Corresponding Source from a network server at no charge using a standard/customary copying method. It is an obligation to those users, not automatically an obligation to publish unrelated private code. The app's Source / license link is intended to expose this repository and the version recorded by the build.
- **Downstream rights:** do not impose further restrictions inconsistent with the granted license (section 10). Preserve access to required source and notices when redistributing, including when you charge for copies.
- **Patents and other obligations:** sections 11 and 12 address patent grants/arrangements and conflicting obligations. The anti-circumvention provisions are in section 3. Additional terms must satisfy section 7; do not invent additional restrictions for AGPL-covered code.
- **Termination:** noncompliance can terminate permissions; section 8 describes reinstatement/cure conditions. Sections 9 and 10 explain acceptance and downstream licensing.
- **Warranty and liability:** sections 15 and 16 disclaim warranty and limit liability to the extent permitted by law; section 17 addresses interpretation. This fork offers no additional warranty.
- **License versions:** follow section 14 and the actual upstream notices. This fork does not silently replace all component licenses with “AGPL-3.0-or-later.”

The full license supplies the exact scope, definitions, exceptions, deadlines and conditions. This summary intentionally does not claim to decide every legal question for every jurisdiction.

## Source and build correspondence

The repository retains upstream source/history plus the modified TypeScript, CSS, JavaScript, Dockerfile, configuration and scripts. `scripts/build.sh` passes the current Git commit as `CPN_SOURCE_REF`; that revision is embedded in the in-app source page. Before sharing an executable or running a modified service for others:

1. Commit the exact source and make that revision available to recipients/users.
2. Build with `./scripts/build.sh`; do not build from unpublished/uncommitted changes while pointing to a different source revision.
3. Keep the source and license links accessible and retain notices and component licenses.
4. Resolve the third-party source/license gaps below for the exact dependencies and binaries you distribute. Record the base images and resolved dependencies; publish/provide their required notices and source as applicable.

If you change the repository owner/name, update the links in `cpn-ide-front/src/assets/modern/source-license.html`. Keep corresponding source available according to the applicable conveyance method, rather than assuming a moving branch link is sufficient for older images. Direct `docker compose build` defaults to `master`; the helper is preferred because it supplies a commit reference.

## Third-party components: observed inventory

This is an inventory of observed notices, not a completed legal clearance or a full transitive software bill of materials. Existing notice files are retained. Generated Angular builds normally include `3rdpartylicenses.txt`; that report is useful but does not cover every separately copied asset or backend/native component.

| Component / location | Observed terms or source of terms |
|---|---|
| CPN IDE source at repository root | GNU AGPL v3, root LICENSE. |
| Access/CPN source modules under `backend/org.cpntools.accesscpn.*` | Individual headers include LGPL 2.1-or-later and GPL 2-or-later; inspect the actual file, not just the root license. |
| Bundled Access/CPN JARs and native simulator in `backend/cpn-ide-back/lib` / engine resources | Upstream binary artifacts retained. Several JARs have no embedded license file, and this build does not rebuild the native simulator. A source header in a related module is not proof that its revision exactly matches a bundled binary. Source/license correspondence needs review before distributing newly built images. |
| OpenXES-20211004.jar, org.Spex.jar | Bundled upstream JARs without an embedded license/notice found in this inventory. Obtain authoritative license and corresponding-source information from their projects/rightsholders; do not infer their terms from the root AGPL file. |
| Eclipse EMF JARs | Embedded `about.html` notices retained inside the JARs; inspect those and the relevant component release terms. |
| javax.activation / JAXB API JARs | Embedded `META-INF/LICENSE.txt` retained; their terms are separate from this fork. |
| Font Awesome Free | `cpn-ide-front/src/assets/fontawesome/LICENSE.txt`: CC BY 4.0 for SVG/JS icons, SIL OFL 1.1 for fonts, MIT for other code. Preserve attribution and respect brand/trademark conditions. |
| Bootstrap and jQuery local assets | Existing author/license headers retained; refer to their MIT terms and bundled notices. |
| Other npm / Gradle dependencies and copied assets | Each retains its own license. Inspect lockfiles, manifests, source headers, generated license report and embedded JAR notices for the exact resolved release. |
| Eclipse Temurin / OpenJDK runtime | OpenJDK is generally GPL v2 with the Classpath Exception, with additional notices for bundled components; inspect the actual runtime's legal files and source availability. This does not license application code under that exception. |
| Debian / Ubuntu runtime files, including glibc | Separate package licenses and source obligations apply; glibc is generally LGPL. Consult the exact base-image/package copyright and source records. |
| Node build image | Used during the source build and not copied as a runtime. Its own component terms still apply to any build image you separately redistribute. |
| Docker Desktop / Docker Engine | External prerequisites, not supplied under this repository's AGPL. Their product licensing and subscription terms are separate. |

No prebuilt images or new binary release packages are published by this repository's workflow. Retaining already-public upstream artifacts in a source fork is not a claim that all possible image redistributions are cleared. The native simulator and opaque bundled JARs need particular attention if you plan to publish an image, ship installers or provide a hosted version.

## Models and output

Using this program does not automatically place independently authored `.cpn` models, reports or other output under AGPL. Under section 2, output is covered only if its content constitutes a covered work. Samples, copied source, embedded material and third-party content can have separate terms. Preserve notices when reusing those materials.

## Primary references

- [GNU AGPL v3, complete text](https://www.gnu.org/licenses/agpl-3.0.html)
- [Upstream license at the base revision](https://github.com/cpn-io/cpn-js/blob/38b72b8f067bb454ab2bf873cb0d9bca1f1f9a1b/LICENSE)
- [GNU GPL FAQ](https://www.gnu.org/licenses/gpl-faq.html)
- [CPN IDE project](https://cpnide.org/)

For a distribution decision involving unresolved third-party permissions, seek the missing project/license information or qualified advice; this document does not invent permission on behalf of those rightsholders.
