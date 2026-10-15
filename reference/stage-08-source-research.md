# Stage 08 W-6 source research (2026-10-02)

Stage 08's chapter centers on identifying assets, testing object ownership on every data path, checking other applicable controls, and recording findings. The existing gathering list says `"OWASP top 10" visual → security`, but a category poster would repeat an awareness list rather than help a reader perform this audit. Search for the following **formats** in order; a useful `security` sheet could be written from the linked primary guidance even if no publishable graphic is found.

| Priority | Search for | What a useful capture would show | Primary source to check against |
| --- | --- | --- | --- |
| 1 | `authorization matrix roles resources actions` / `IDOR testing two users same object` | Actors or roles × operations × records, including owner, other user, admin, and anonymous; a denied cross-user attempt. Convert to editable rows or an interactive matrix, not a screenshot of code. | [OWASP Authorization Testing Automation](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html) defines an authorization matrix; [OWASP IDOR Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) gives a two-user test and says UUIDs do not replace access control; [WSTG-ATHZ-04](https://wstg.owasp.org/latest/4-Web_Application_Security_Testing/05-Authorization/04-Insecure_Direct_Object_References/) describes testing object references. |
| 2 | `threat model data flow diagram trust boundaries web app` / `OWASP Threat Dragon sample threat model` | User, app, data store, and external service with labeled data flows and trust boundaries; annotate the data or action at risk. A generic STRIDE acronym graphic alone would be thin. | [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) describes these elements; [OWASP Threat Dragon](https://owasp.org/projects/threat-dragon) offers sample diagrams and a local demo. |
| 3 | `web application security audit findings template scope evidence remediation` | Compact finding record: asset/endpoint, unauthorized behavior, reproduction, impact, fix, retest and accepted-risk owner. The project chapter calls for an audit record. | [OWASP WSTG Reporting](https://wstg.owasp.org/stable/5-Reporting/README/) describes finding IDs, risk, impact, reproduction and remediation; its consultancy-style full report is explicitly more than an internal audit may need. |
| 4 | `OWASP ASVS 5 authorization requirements checklist` | Selected, versioned requirements mapped to Stage 08 controls. Use as a verification source, not a claim that a small app has passed the full standard. | [OWASP ASVS](https://github.com/OWASP/ASVS) lists stable v5.0.0 and prescribes version-qualified requirement IDs such as `v5.0.0-1.2.5`. |

Use [OWASP Top 10:2025](https://top10.owasp.org/2025/0x00_2025-Introduction/) as a current risk index and link for context. Its A01 is Broken Access Control, but the list does not itself provide this app's permission policy or test evidence. [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) says to deny by default and validate permission on every request. [Next.js Authentication guidance](https://nextjs.org/docs/app/guides/authentication) says Server Actions and Route Handlers each need authorization, and recommends centralizing it in a data access layer. Match Next.js examples to this repo's installed docs before publishing code.

For any third-party capture, retain the creator, original post URL and permission or applicable license at collection time. The repo's `reference/cheatsheet-sources.md` requires provenance for publication. A redrawn matrix grounded in the application's own invoice example will likely be more useful than republishing an unverified social graphic. Do not treat audit tool output or a Top 10 poster as proof that object-level authorization was tested.

## Downloaded source captures · 2026-10-02

Three files were inspected at native size and logged with original image URLs,
creator pages and license statements in `reference/cheatsheet-sources.md`:

- `stage08-authorization-matrix.png` (1480 × 971): readable OWASP rendering of
  roles, routes and methods. It omits object ownership, Stage 08's main test.
- `stage08-threat-data-flow-overview.jpg` (749 × 412): a historical OWASP library
  example showing users, librarians, data stores and trust boundaries.
- `stage08-threat-login-flow.jpg` (760 × 469): the same model's login detail.

These are gathering assets, not registered sheet images. The two threat-model
figures are older examples and do not establish current Next.js practice. A
two-user IDOR test and an audit-finding record still need original treatment
from the cited text guidance; no suitable first-party infographic was found.
