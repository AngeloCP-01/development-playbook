# Context usage audit — 2026-09-10

**Why:** subscription moved from Max to Pro. Pro's 5-hour window is a fraction of Max's,
so the question is where the tokens actually go and what can be cut without changing how
the project is delivered.

**Method:** measured, not guessed. Sources were the 26 session transcripts for this project
(`~/.claude/projects/-Users-angelito-personal-Development-Playbook/`, 2026-08-13 → today),
the 375 subagent transcripts under them, the installed plugin caches, each SessionStart hook
run by hand with a fake session, and claude-mem's SQLite database. Token counts for files
use bytes ÷ 4; usage figures come straight from the `usage` block on each assistant message.

**Weighting:** the plan does not bill in raw tokens. Throughout this doc "input-equivalent"
means the standard API weighting: cache read × 0.1, cache write × 1.25, uncached input × 1,
output × 5. It is a proxy for how fast the window drains, not a dollar figure.

---

## 1. The headline: skills are not where the tokens go

| Bucket | Cache read | Cache write | Output | Input-equiv | Share |
|---|---|---|---|---|---|
| Main sessions (26, ~11.7k turns) | 3,963M | 67.6M | 10.3M | ~532M | 61% |
| Subagents (375 transcripts) | 1,890M | 93.6M | 5.5M | ~334M | 39% |
| **Total** | **5,853M** | **161M** | **15.8M** | **~866M** | |

- **Cache reads are 68% of the weighted spend.** Every turn re-reads the whole conversation.
  Average context per main-session turn is **~338k tokens** (3,963M ÷ 11.7k turns). The
  2026-08-13 session averaged 457k per turn across 2,055 turns.
- **Subagents are 39%.** 343 `Agent` calls in 26 sessions; 375 transcripts. Their cache
  *writes* (93.6M) exceed the main sessions' (67.6M) because each subagent starts cold.
- **The fixed per-turn baseline is 55–66k tokens** (first-turn context of recent sessions:
  59k, 65k, 66k, 66k). Everything removable in that baseline — every plugin, MCP server and
  hook this doc lists — adds up to **~11.4k tokens per turn**, about 3% of the average
  turn and roughly **1.5–2% of total spend**.

So: cutting plugins is worth doing and is listed below, but it is hygiene. The window is
drained by context length, subagent fan-out, and running Opus at high effort on everything.
Section 4 is the part that matters.

---

## 2. What loads every session, and what it costs

### 2a. Fixed baseline (paid on every turn via cache read)

| Component | ~Tokens/turn | Uses in 26 sessions | Verdict |
|---|---|---|---|
| Base system prompt + core tool schemas (Bash, Edit, Artifact…) | ~30–35k | — | not controllable |
| `CLAUDE.md` (19,870 bytes) | ~5,000 | — | keep; see §5 |
| **claude-mem** context injection (`SessionStart` hook, 50 observations) | **~5,400** | `mem-search` 0, `get_observations` 0 | **cut** |
| claude-mem skill listing (15 skills) + 20 MCP tool names | ~1,250 | 0 | cut (same plugin) |
| **vercel** plugin: 33 skill descriptions + 4 commands + 3 agents | **~2,800** | **0** | **cut** |
| superpowers `SessionStart` hook (using-superpowers, measured 3,461 chars) | ~865 | — | keep |
| superpowers skill listing (14 skills) | ~465 | 99 invocations | keep |
| claude-in-chrome: instruction block + 22 deferred tool names | ~800 | 3 calls | cut for this project |
| playwright MCP: 24 deferred tool names | ~250 | 114 calls | keep |
| impeccable: description + 4 agents | ~520 | 1 | cut |
| ui-ux-pro-max description | ~250 | 0 | user's call |
| cv-cover-writer (user-level skill) | ~210 | 0 (wrong project) | move to `career-ops` scope |
| humanizer description | ~110 | 12 | keep |
| frontend-design description | ~50 | 0 as `Skill`, but project-enabled by design | keep |
| find-skills | ~75 | 0 | cut (trivial) |
| `memory` MCP server (`@modelcontextprotocol/server-memory`), 9 tool names | ~100 | 0 | cut |
| context7 MCP, 2 tool names | ~25 | 7 | keep |
| auto-memory `MEMORY.md` | ~300 | — | keep |

Vercel's own SessionStart hooks (`session-start-profiler`, `inject-claude-md`) were run by
hand against this repo: they inject **nothing** here, because the activation markers
(`vercel.json`, `.vercel/`) live under `web/`, not the root. So the Vercel cost is purely
the listing — but it is the single largest listing on the page, and none of its 33 skills
was ever invoked.

### 2b. Per-invocation cost (paid only when a skill is used)

| Skill | Body | Reference files | Invocations |
|---|---|---|---|
| superpowers:subagent-driven-development | 8.0k | 5.0k | 11 |
| humanizer:humanizer | 8.5k | 3.9k | 12 |
| superpowers:writing-skills | 6.6k | 17.5k | 0 |
| superpowers:brainstorming | 3.8k | 3.8k | 28 |
| ui-ux-pro-max | **11.2k** | large CSV data | 0 |
| impeccable | 2.7k | **89k** across 39 files | 1 |
| superpowers:systematic-debugging | 2.4k | 6.1k | 3 |
| superpowers:test-driven-development | 2.3k | 2.1k | 0 as `Skill` (invoked by SDD subagents) |
| vercel:* (33 skills) | 1–11k each | up to 99k (react-best-practices) | 0 |

The skills that are actually used (brainstorming, writing-plans, SDD, finishing-a-branch,
humanizer) are the process. Their bodies are modest; the cost of SDD is in the subagents it
dispatches, not in the skill text.

---

## 3. claude-mem: the hidden second consumer

claude-mem is not just a 6.6k-per-turn listing. Its settings (`~/.claude-mem/settings.json`):

```
CLAUDE_MEM_PROVIDER            = claude
CLAUDE_MEM_CLAUDE_AUTH_METHOD  = subscription
CLAUDE_MEM_MODEL               = claude-haiku-4-5-20251001
CLAUDE_MEM_CONTEXT_OBSERVATIONS = 50
```

It runs a `PostToolUse` hook on **every** tool call (4,012 Bash + 675 Edit + 448 Read + … in
this project) and feeds the results to a Haiku observer **authenticated with your
subscription**. That observer's reads come out of the same Pro window as the main session.

From its database, for this project alone:

| | Observations | Tokens read by the observer |
|---|---|---|
| All time | 246 | **1,123,183** |
| 2026-09-07 (one day, across all projects) | 195 | **963,108** |

Haiku is weighted cheaply, but a million tokens of background reading in a day is not free
on Pro, and it buys something the repo already has: `docs/tracker.md` holds numbered
decisions, `docs/learnings/` holds the expensive lessons, and the auto-memory directory
holds the cross-session preferences. `mem-search` was never invoked. `CLAUDE.md`'s tooling
table lists claude-mem for "did I already decide this?" — the transcripts say that question
gets answered by grepping the tracker.

**Recommendation: disable claude-mem** (globally, or at minimum exclude this project via
`CLAUDE_MEM_EXCLUDED_PROJECTS`). Update the `CLAUDE.md` tooling table accordingly.

---

## 4. The levers that actually move the number

Ranked by estimated saving. None of these change the delivery loop; they change how much
context each step carries.

### 4a. Context length per turn — the biggest lever (~68% of spend)

`~/.claude/settings.json` has `"model": "opus[1m]"` and `"autoCompactEnabled": false`.
Sessions run until they are hundreds of thousands of tokens deep, and every turn re-reads
all of it. Cache reads are cheap per token but they are 5.85 **billion** of them.

- **Turn auto-compact back on**, or `/compact` manually when the context passes ~120–150k.
  Halving the average context halves the largest line item.
- **One session per plan** (already a memory: "the plan runs in a fresh session"). Extend
  it: one session per coverage-walk round, one per stage doc round. The 2,055-turn session
  is the anti-pattern.
- Check whether Pro even grants the 1M window. If it does not, `opus[1m]` is moot as a
  setting but the habit of letting sessions grow is not.

### 4b. Subagent fan-out (~39% of spend)

343 `Agent` calls. Model overrides so far: `sonnet` 202, `opus` 62, inherit (= Opus) 51,
`haiku` 28. Types: `general-purpose` 228, default 69, `Explore` 24.

- **Never let a subagent inherit Opus.** Implementers and reviewers on `sonnet`; `Explore`
  on `haiku`. The 113 Opus-or-inherited dispatches were the expensive ones.
- ~~Per-task review is where the diff gets re-read (one diff file read 55 times, ~297k
  tokens).~~ **Corrected on a second look:** superpowers 6.3.0's SDD skill already hands
  each reviewer a bounded diff file and tells it to read it once; 55 reads across a
  multi-task plan with fix rounds is the design working, at ~5.4k tokens a read. Not a
  lever.
- **Scale the reviewer to the task.** A docs-only task (tracker row, KICKOFF refresh) does
  not need a spec-review subagent *and* a code-quality subagent. CLAUDE.md already says
  "scale the ceremony, not the discipline"; apply it to dispatch count.

### 4c. Model and effort for the main session

`"effortLevel": "high"` and Opus for everything. Opus drains Pro roughly 5× faster than
Sonnet per token. Routine turns — tracker updates, KICKOFF refreshes, running the gate,
committing — do not need it.

- Default the main session to **Sonnet 5**; switch to Opus for brainstorming, spec review
  and the final whole-branch review, where judgement is the deliverable.
- Effort `medium` by default; `high` for the same set.

### 4d. Big files that get read whole

| File | Size | ~Tokens if read whole | Reads so far |
|---|---|---|---|
| `docs/tracker.md` | 417 KB | **~105k** | 69 (2 unbounded) |
| `docs/task.md` | 74 KB | ~19k | (KICKOFF says read it at session start) |
| `docs/04-project-setup.md` | — | — | 62 reads, **25 unbounded** |
| `web/PATTERNS.md` | 29 KB | ~7k | read before every stage build |

- Split `tracker.md`: move closed slices and struck-through follow-ups into
  `docs/tracker-archive.md`. A 105k-token file one bad `Read` away from the context is a
  risk on any plan, and a real cost on Pro.
- The "check `task.md` and `KICKOFF.md`" session opener should read the *Project state*
  section of KICKOFF, not all of task.md. KICKOFF exists so that task.md does not have to
  be read.
- Image reads inflate transcript size but not model tokens (images bill by pixel area, not
  by base64 length), so the reference GIFs/PNGs are not the problem they look like in raw
  transcript bytes.

---

## 5. Recommended cuts, in order

| # | Action | Saves | Risk |
|---|---|---|---|
| 1 | Enable auto-compact; one session per round | largest — halves cache reads if average context halves | compaction summaries lose detail; the tracker/KICKOFF discipline already covers that |
| 2 | Subagents on `sonnet`/`haiku`, never inherit; reviewers get bounded diffs | tens of millions input-equiv | reviewer quality on Sonnet — the source project's catches (XSS, cookie leak) were judgement calls; keep Opus for the *final* whole-branch review only |
| 3 | Main session Sonnet + medium effort for routine turns | ~5× on those turns | none for docs/tracker/gate work |
| 4 | **Disable claude-mem** | 6.6k/turn + ~1M/day background Haiku reads + PostToolUse latency on every call | lose cross-session recall — replaced by tracker, learnings, auto-memory |
| 5 | **Uninstall vercel plugin** | 2.8k/turn | none — deploy is a push to `main`; the CLI is unused |
| 6 | Disable claude-in-chrome for this project | ~800/turn | none — playwright MCP is the one in use (114 vs 3 calls) |
| 7 | Disable impeccable | ~520/turn + a hook on every Edit/Write | none — frontend-design is the project-enabled design skill |
| 8 | Remove `memory` MCP server; scope cv-cover-writer to `career-ops`; drop find-skills | ~400/turn | none |
| 9 | ui-ux-pro-max: keep or cut | ~250/turn; 11k on invoke | CLAUDE.md says "in regular use"; 26 sessions say 0 uses. If kept, fix the CLAUDE.md claim |
| 10 | Split `tracker.md`; stop reading `task.md` whole at session start | avoids 19–105k single reads | none |

**Keep, unchanged:** superpowers (the process; 99 invocations), humanizer (12, required by
CLAUDE.md), frontend-design, context7 (7 uses, 2 tools), playwright MCP, `CLAUDE.md` itself
(5k/turn is the cheapest 5k in the baseline — it is what stops re-explaining the repo).

Items 4–8 are configuration and can be done in one sitting. Items 1–3 are habits and a
settings change. Item 10 is a docs task that should go through the normal loop.

---

## 6. Housekeeping noticed on the way

- `.claude/worktrees/` holds three agent worktrees from 2026-09-04, each a full checkout
  including the reference images. Not a token cost, but ~3× the repo on disk.
- Session transcripts for this project are 309 MB; claude-mem's data directory is 344 MB.
- `frontend-design` is installed three times (two stale `local` entries for other paths).

---

## Applied after review (2026-09-10)

- User disabled plugins via `/plugin` and removed the `memory` MCP server.
- **Lever 4b applied:** subagent model policy added to `CLAUDE.md` (*Workflow
  preferences → Subagent models*), with the role → tier table and four quality guards.
  What the transcripts showed before the policy: implementers were already Sonnet (94 of
  114); the Opus spend was 13 Explores that inherited the session model and 63 reviewers.
  The guards are what stop the cheaper reviewer being a worse one: evidence-or-rejected,
  per-task escalation on named triggers, model-independent TDD evidence, and the Opus
  final review kept as backstop and as the measurement of whether the tier holds.
- **Lever 4d applied (item 10):** `docs/tracker-archive.md` takes 34 closed debt headings and
  23 pre-August Completed rows, verbatim; live tracker 415,081 → 303,135 bytes (~104k → ~76k
  tokens), 0 lines lost. Decisions stay. `web/src/lib/tracker-ledger.test.ts` guards ids
  across the two files. KICKOFF's read list now says grep, never read, for both, and names
  the one `task.md` section a round needs. D-96. Less than the audit's "half" — the
  remaining Completed rows are long; a 2026-08-15 cut would take ~7k more.
- **Lever 4c applied globally:** `~/.claude/settings.json` `model` `opus[1m]` → `sonnet`,
  `effortLevel` `high` → `medium`. Opus is now opted into per session. The session → model
  mapping is in `CLAUDE.md` (*Workflow preferences → Session model*) and the KICKOFF
  preparer's notes say which model to open on. The split follows the existing habit:
  brainstorm/spec/plan sessions on Opus, execution and doc rounds on Sonnet, the final
  whole-branch review on Opus as a subagent regardless of the session model.
- **Lever 4a applied globally:** `autoCompactEnabled` false → true in `~/.claude/settings.json`
  (backup alongside it). The one-session-per-round habit is the other half and is not a setting.
- claude-mem **kept**, on the user's call: it is the one thing that survives a session
  dying before KICKOFF is refreshed. Made cheap instead of removed
  (`~/.claude-mem/settings.json`, backup at `backups/settings.json.2026-09-10-pre-audit`):
  - `CLAUDE_MEM_CONTEXT_OBSERVATIONS` 50 → 15, `CLAUDE_MEM_CONTEXT_SESSION_COUNT` 10 → 3.
    Injection re-measured: 21,594 → 11,137 chars (~5.4k → ~2.8k tokens). What remains is
    mostly the last session's summary, which is the part that gets used.
  - `CLAUDE_MEM_SKIP_TOOLS` now also skips `Bash, Read, Grep, Glob, ToolSearch,
    TaskUpdate, TaskCreate`. The observer fires on Edit/Write/Agent, where the
    observations of value come from, and no longer on the ~4,000 shell calls per project.
  - Provider stays on `claude` / subscription. Switching to Gemini or OpenRouter would
    take the observer off the Pro window entirely, but both require an API key and none
    is configured. Add one if the background usage still bites.

## Not done in this audit

- Nothing committed. The settings changes above live outside the repo.
- Not run through `humanizer` — the document is mostly tables and CLAUDE.md exempts those.
- Token counts for files are bytes ÷ 4, so listing figures carry ±20%. The usage figures in
  §1 and §4 are exact from the transcripts.
