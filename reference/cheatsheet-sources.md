# Cheatsheet gathering list

What to search for on LinkedIn, in the order worth gathering. Design for the hub
that consumes these is parked in
`docs/superpowers/specs/2026-08-14-reference-hub-design.md`.

Each planned sheet lists its future slug and the stage it tethers to, so captures
can be filed against a target rather than piling up unsorted.

## How to search

LinkedIn's post search is weak on keywords and strong on format filters. Two
settings do most of the work:

- **Posts → Content type → Documents.** Carousel PDFs are multi-page, higher
  resolution, and readable directly — a ten-page carousel converts far better than a
  compressed GIF. Run every query below under Documents before Images.
- **Sort by Top match**, not Latest. These graphics recirculate for years; the
  best version of a topic is rarely the newest.

Hashtag search often beats keyword search for this format: `#systemdesign`
`#softwarearchitecture` `#cheatsheet` `#softwareengineering` `#coding`.

Following two or three people who publish this style surfaces more than searching
does. Reliable in this format: ByteByteGo / Alex Xu, Brij Kishore Pandey,
Nikki Siapno, Sahn Lam, Arslan Ahmad, Milan Jovanović (.NET-leaning).

## What makes a capture worth keeping

Good: discrete labelled boxes, directional arrows, eight or fewer concepts, text
legible at 100% zoom. That converts cleanly into rows and figures.

Bad: screenshots of code, dense syntax tables rendered as pixels, paragraphs set in
an image. For those the transcription is worse than writing the sheet from scratch —
capture them as prompts for your own sheet, not as things to reproduce.

**Record the post URL and author at capture time.** The `source` field needs
`{ title, author, url }`, and a GIF with no provenance cannot be published on a live
site. Log it in the ledger at the bottom of this file as you go.

---

## Priority 1 — the ones that pay off immediately

### Git commands · `git-commands` · stage 04

```
"git commands" cheat sheet
"git cheat sheet" visual
"git undo" mistakes
"git merge vs rebase"
"git reset" soft hard mixed
```

Most of this you can write from your own conventions without a source at all. Gather
for structure and for the commands you have forgotten exist, not for wording.

### Git branching and conventions · `git-branching` · stage 04

```
"git branching strategy"
"gitflow vs trunk based development"
"trunk based development" explained
"conventional commits"
"semantic versioning" cheat sheet
"pull request" checklist
```

CLAUDE.md already documents this project's own branching policy and commit format,
so this sheet is largely a restatement of decisions already made. Gather comparisons
of the alternatives, not the convention itself.

### Coding standards · `coding-standards` · stage 05

```
"clean code" principles
"SOLID principles" explained
"code review checklist"
"naming conventions" cheat sheet
"code smells" list
"refactoring techniques"
```

## Priority 2 — the diagram-heavy pair

### Software architecture patterns · `architecture-patterns` · stage 03

Already captured and transcribed to `software-architecture-patterns.md`. Gather
alternates only if one covers patterns the current sheet misses — pipe-and-filter,
hexagonal / ports and adapters, CQRS, serverless.

```
"software architecture patterns"
"architecture patterns" comparison
"hexagonal architecture" explained
"CQRS" event sourcing explained
"monolith vs microservices"
```

### Design patterns · `design-patterns` · stage 03

```
"design patterns" cheat sheet
"gang of four" patterns visual
"creational structural behavioural" patterns
"singleton factory observer" explained
"design patterns" in one picture
```

Twenty-three patterns will not fit one readable sheet. Look for graphics that split
by category, or plan to split it into three sheets at authoring time.

## Priority 3 — supporting sheets worth having

```
"HTTP status codes" cheat sheet          → api-reference   · stage 03
"REST API" design best practices         → api-reference   · stage 03
"SQL joins" visual                       → sql-reference   · stage 03
"database indexing" explained            → sql-reference   · stage 03
"caching strategies" explained           → caching         · stage 09
"load balancing" algorithms              → scaling         · stage 09
"testing pyramid" explained              → testing         · stage 06
"OWASP top 10" visual                    → security        · stage 08
"docker commands" cheat sheet            → containers      · stage 11
"kubernetes" cheat sheet                 → containers      · stage 11
```

## Priority 4 — language and framework sheets

These have the weakest tie to the playbook and go stale fastest. Official docs beat
any infographic for syntax. Gather these only where the graphic teaches a *mental
model* rather than listing syntax — the event loop, the collections hierarchy, the
annotation lifecycle.

```
"JavaScript array methods"               → javascript · no stage tether
"ES6 features" cheat sheet
"async await vs promises" visual
"JavaScript event loop" explained

"Python cheat sheet"                     → python · no stage tether
"python list comprehension" explained
"python data structures" comparison

"Java collections framework"             → java · no stage tether
"java streams" cheat sheet
"JVM memory model" explained

"Spring Boot annotations" cheat sheet    → spring-boot · no stage tether
"spring boot" architecture layers
"spring bean lifecycle"

"Express middleware" explained           → express · no stage tether
"Node.js event loop" explained
"nodejs architecture" diagram
```

---

## Filing

Captures land in `reference/` as gathered. They are **not committed** — the originals
run 1–4MB each and git keeps every version forever.

What is committed is the converted copy in `web/public/reference/`, which is what the
site serves. Convert with `sharp` before wiring a sheet to it:

```js
sharp(src, { animated: false }).webp({ quality: 82, effort: 6 }).toFile(out)
```

Quality 82 is where these flat-colour infographics stop losing the small labels;
verify by reading the output before committing rather than trusting the number.
Measured on this batch:

| Original | Was | Now | Saved |
|---|---|---|---|
| `MasterPlan-Api-Design.gif` | 3817K | 196K | 94.9% |
| `Software-Architecture-Patterns.gif` | 1024K | 121K | 88.2% |
| `git-commands.jpeg` | 210K | 138K | 34.2% |
| `software_design_patterns.jpeg` | 262K | 182K | 30.6% |

The two GIFs are static images that were stored as GIF, which is why they collapse
so far. Name the output `<target-slug>.webp`, all lowercase and hyphenated — a test
asserts every registered `src` exists on disk, so a mismatch fails the suite rather
than shipping a broken-image box.

## Ledger

| Target sheet | Source title | Author | URL | File | Captured |
|---|---|---|---|---|---|
| `architecture-patterns` | Software Architecture Patterns | Sathish Kumar Subramani | *not recorded* | `Software-Architecture-Patterns.gif` | 2026-08-14 |
| `design-patterns` | *not recorded* | *not recorded* | *not recorded* | `software_design_patterns.jpeg` | 2026-08-14 |
| `api-design` | Master Plan for API Design | Shalini Goyal | *not recorded* | `MasterPlan-Api-Design.gif` | 2026-08-14 |
| `git-commands` | *not recorded* | *not recorded* | *not recorded* | `git-commands.jpeg` | 2026-08-14 |
