# Stage 04 — implementation status

**What this is:** the coverage map for stage 04, doc against app, section by section. It
exists for the reason stage 03's does — a stage and its port drift, and the drift gets
discovered rather than tracked — and because this round proved the failure mode is real:
a review found five doc sections whose material the app never taught, and every one of
them had been assigned to a panel by the plan's own line ranges.

**Last verified:** 2026-08-17, on `feat/stage-04-app-port` at `dc4c46d`, after the Wave 3
coverage review and its fix wave.

**Current state:** doc **10 numbered sections + 5 closing sections / 711 lines**. App
**15 steps**. 518 tests across 62 files; a 17-test audit suite over **63 derived URLs**.
Lint, typecheck and `format:check` clean. Glossary unchanged — this stage invented no
term, and every one it wraps already existed.

**Fifteen steps was not a target, and unusually it was not a revision either.** The Phase 5
re-cut proposed fifteen against measured panel costs; all fifteen shipped, and all four
provisional pairs from D-65 stayed split because their combined heights (4.80, 5.40, 3.54,
4.23) clear the 3.2 ceiling. This is the first seam in this repo to survive measurement
unchanged. Stage 03 re-cut five of six.

**One panel was re-cut, and it is the useful entry in this file.** Adding the five missing
sections took `scaffold` from 2.89 to **4.25** — past the working ceiling and past the
audit's own 4.0 gate. It came down in three measured steps: the pin files behind an
expand-to-reveal (D-49's precedent), prose cut where it restated an artifact's own note,
and the disclosure folded from three rows to one. **4.25 → 3.47 → 3.34 → 2.99.**

---

## Panel weight

Measured at 1024×768 with the audit's method (`#panel-<id>` bounding height ÷ 768), on a
fresh build with `:3100` killed first (TD-27).

| Step | Screens | Step | Screens |
|---|---|---|---|
| `scaffold` | 2.99 | `deploy` | 2.94 |
| `structure` | 1.81 | `verify` | 1.29 |
| `format` | 2.67 | `proof` | 2.27 |
| `strict` | 1.58 | `ai` | 1.28 |
| `env` | 2.90 | `checklist` | 2.25 |
| `client` | 2.50 | `traps` | 1.57 |
| `hooks` | 2.83 | | |
| `ci` | 2.35 | **median** | **2.27** |
| `enforce` | 1.19 | **max** | **2.99** |

`enforce` is the lightest panel in the app and below the 1.70 the spec recorded as minimal
chrome — that figure came from the lightest *authored* stage-03 panels, so it is a floor
for that stage rather than a law. A review checked every clause of §7's branch-protection
material against it and found nothing missing. Roughly half of what it does carry is a
second telling of annotations already on the `ci` artifact, which is a real observation
about the pair and not a reason to pad the panel.

---

## Coverage, doc against app

| Doc section | App | Notes |
|---|---|---|
| §1 Scaffold | `scaffold` | Full. `scaffoldCmd` and `repoCmd` artifacts, the three pin files behind a disclosure, `PinExercise` over the three environments |
| §2 Set the folder structure | `structure` | Full. `TreeInspector` over the 17-node tree, `src/db/` marked conditional in the rendered tree |
| §3 Linting and formatting | `format` | Full. `prettierrc`, `formatScripts`, `prettierignore`, `lint` |
| §4 TypeScript settings | `strict` | Full. `tsconfig`, `typecheck` |
| §5 Environment variables | `env`, `client` | Full across the pair. `env` and `envExample` artifacts plus a `Contrast` on the gate-not-wishlist judgment; `client` carries `ClientTrap`, the `testScript` artifact and the `--passWithNoTests` argument |
| §6 Git hooks | `hooks` | Full. `lefthook` and `prepare` artifacts, the glob trap, the `\|\| true` explanation |
| §7 CI, on day one | `ci`, `enforce` | Full across the pair. `ci` artifact and the secrets-the-build-needs point; `enforce` carries the job-id-not-workflow-name distinction, the GitHub Free limit, and enforcement-versus-verification as a two-row disclosure |
| §8 Connect Vercel | `deploy`, `verify` | Full across the pair. The three dashboard settings, the Node.js Version exception, the environment-variable paragraph, `DeployBlockers`, the `catFile` artifact, and load-it-do-not-fetch-it |
| §9 Error tracking | `proof` | Full. The auth-token gap **and its fix**, `.env.sentry-build-plugin` named, the `boomRoute` artifact, the TEMP commit label |
| §10 Write the README | `proof` | Full. The three sections, and the rollback commands as a three-row disclosure including the migration case |
| AI in project setup | `ai` | Five plays via `AIPlays`, `AI_LIMIT` outside the rows. **Not ported:** the closing named-tools line |
| Artifacts | `checklist` | Full, as an eight-item inventory beside the checklist |
| Definition of done | `checklist` | Full. Eight items, persisted, labels held verbatim against the doc |
| Scaling to a team | `checklist` | Four moves via `TeamNotes` |
| Traps | `traps` | Seven, as `Callout kind="trap"` |
| Entry criteria | — | **Not ported.** Consistent with stages 01–03, none of which port theirs. Recorded because stage 04's carry the database decision that `tree.ts` and the `env` artifact both depend on and quote |

### Not ported, deliberately

- **§1's no-`gh`-CLI fallback** — create an *empty* repository in the web UI, then
  `git remote add origin` and `git push -u origin main`. The `gh` path is shown; the
  manual one is a second route to the same state.
- **§8's `/robots.txt` canonical-origin check.**
- **The AI section's closing named-tools line** — context7, `claude-mem`,
  `verification-before-completion`.

---

## What holds the port to the doc

Seven data modules, each with a test that reads `docs/04-project-setup.md` at run time and
derives its expected count from the file rather than from a number typed into a brief.
That is the whole reason the wave was ordered data-first, and it earned itself twice:

- The plan's traps regex sliced from `DOC.indexOf('## Traps')`, which matches §7's *prose*
  about what to put in a README, and counted **nine** traps where the doc has **seven**.
- The plan's `PIN_RULE` test asserted `DOC.toContain(...)` against a sentence the doc
  hard-wraps mid-clause. No value would have passed it.

`artifacts.ts` holds **nineteen** config blocks character-for-character against the doc's
fenced blocks — compared whole, not by containment (**D-66**), because `toContain` cannot
see a truncated artifact and a review demonstrated that by deleting the line §5 exists for.

`doc-source.ts` is the single reader. Its section slicing is anchored to a heading on its
own line and bounded at the next heading of the same level or higher, never at `^#` — a
single hash and a space is a shell comment, and this document is full of fenced bash.
