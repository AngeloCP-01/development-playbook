# Cold-reader test — Stage 03 (Architecture), run 4

**Product:** a shift-swap app for a restaurant. Staff post shifts they cannot work,
colleagues claim them, managers approve.

**Method:** read `docs/03-architecture.md` and nothing else. No cross-referenced stage docs,
no glossary, no web app, no search, no prior architecture knowledge. Every cross-reference
(`05 — Development`, `11 — CI/CD`, `13 — Production Deployment`, `02 — Planning`) treated as
"deliberately not here", with a note of what I needed at that point.

---

## Verdict

**COMPLETE**, with two boxes I cannot tick honestly and one artifact I produced by
combining two of the document's rules in a way it never demonstrates.

The sentence I would say to the author:

> I got all ten artifacts out of this — including the two hardest ones, the concurrency
> strategy and the tenant axis, which the document nails — but two Definition-of-done boxes
> are blocked by the document arguing with itself: **third normal form and "store facts about
> a moment" give opposite verdicts on the same column of the same example (an invoice's
> shipping address), and the tenant-key rule "carried on every table" forces a third-normal-form
> violation on any product whose hierarchy is more than one level deep.** Both are one
> paragraph away from being fixed, and until they are, a careful reader hits them and cannot
> tell which rule wins.

Stall count: **4** (one hard, three soft).
Guess count: **8**.

---

## 1. Stalls

A stall = I could not proceed without inventing something the document does not give me, or
without knowledge I was told not to use.

### S1 (hard) — no fitness-function example for two of the three characteristics I picked

> "The answers are more ordinary than the term suggests. The cheapest useful one is usually a
> plain test that asserts a fact about your own schema … Beyond that: a test that fails when
> one feature imports another's internals … a build-size budget … a query-count assertion"
> — *What this system has to be*

The document then requires, in the Artifacts list and the Definition of done:

> "For each characteristic, one line on how you would know if it stopped holding"

The four examples given map to **correctness** (schema assertion), **evolvability** (import
linter), **latency** (build-size budget, query-count). My three are correctness, auditability
and cheap-to-run. Two of three have no example — and **cheap to run is one of the three the
document's own invoicing example picks**, so the example it walks does not survive its own
requirement either.

I stalled on auditability and cost, then wrote proxies I have no confidence in:

- Auditability — "a test asserting `claim_decisions` exports no update or delete function from
  its repository module." I invented the idea that append-only can be checked at the code
  boundary rather than the schema; the document never suggests it.
- Cheap to run — "a test asserting `package.json` contains no queue, cache or broker
  dependency." This is a paraphrase of the import-linter example pointed somewhere it was not
  aimed. It also checks nothing about actual cost.

**What I needed:** one worked line for a non-latency, non-correctness characteristic. Even
"cost is the one you check by looking at the bill monthly, and that is a calendar reminder, not
a test" would have closed it — a stated refusal is usable, an absence is not.

### S2 (soft) — the domain model starts from an artifact I could not open

> "Take the vertical slices from [02 — Product Planning] and underline every noun in them."

Treating 02 as absent, I had nothing to underline. I recovered by writing four slices myself
(post a shift · claim a posted shift · approve a claim · see the roster), because the invoicing
model is shown in nouns further down and I could pattern-match the shape.

**What I needed:** one clause — "if you do not have slices written down, a list of the four or
five things a user can do is close enough." The recovery took me a paragraph, and I am not sure
my slices were the right granularity.

### S3 (soft) — the scheduled job is drawn as a box and then exempted from the down-case question

> "Then ask the question that makes the whole sketch worth drawing: **for each box that is not
> yours, what happens when it is down?**"

The container diagram has five non-application boxes: payment provider, auth provider, email,
blob storage, and **scheduled job**. Four get a down-case answer. The scheduled job gets none,
presumably because it is "yours" — but it is drawn as a separate box, it runs on someone else's
platform, and the section that discusses it hands its operation to 11 — CI/CD.

This is not academic for my product. My scheduler's job is "nudge the manager about claims still
pending on a shift starting within three hours." **If it silently does not run, a shift goes
unfilled and nobody is on the floor at 6am.** That is the highest-severity failure in the whole
system and the diagram's method routes right past it.

Postgres has the same problem — it is a box in the diagram, it is not code I wrote, and it gets
no down-case either.

**What I needed:** either the scheduler and the managed database in the down-case list, or one
sentence saying the question applies only to third-party HTTP dependencies and why your own
async infrastructure is handled elsewhere.

### S4 (soft) — no shape for an inbound dependency that is not a webhook

The document classifies received things exactly once:

> "**A webhook you receive** | Not yours to change | Somebody else owns the shape; you adapt"

and

> "for anything you receive, you do not get to choose. A payment webhook is asynchronous because
> somebody else decided it is"

My restaurant already has a rota system. My `shifts` table is plausibly *sourced from it* — a
nightly pull, or a CSV the manager uploads. That is received data whose shape I do not own, it is
not a webhook, nobody pushes it, and it is the single largest architectural question in my
product. The document has no row for it, no diagram box for it, and no down-case template.

I proceeded by transferring the webhook machinery myself (see G5). It worked, but I chose to do
that; the text did not tell me to.

---

## 2. Guesses — proceeded, but invented

More dangerous than stalls, because they look like success.

### G1 — declining availability, when my product has a hard deadline

> "**Pick three or four.** Not because a longer list is hard to write, but because they trade
> against each other … High availability costs money. Strong auditability costs write throughput.
> Cheap-to-run costs both."

I picked correctness, auditability, cheap to run — copying the invoicing example's three almost
exactly. But my system is not invoicing. The document's own cadence paragraph names my case:

> "A daily sweep is right for an invoice reminder and wrong for a shift confirmed at 9pm for 6am"

A swap posted at 9pm for a 6am shift needs the system up at 9pm. That is an availability
requirement in a *window*, not a 99.9% number, and cheap-to-run directly opposes it. The document
tells me these trade and does not tell me how to arbitrate — the only method offered is "pick
fewer", which is not the same as knowing which to drop.

**With more information I would have:** picked availability as a fourth and traced it, or found a
sentence in the document saying that a characteristic which only bites inside a window is handled
by degrading the feature (fall back to a phone call) rather than by buying uptime. I invented that
fallback. It may be the right answer; it is not one the text gave me.

### G2 — splitting `role` into two columns

The document's own actors table:

```sql
role text NOT NULL CHECK (role IN ('member','manager'))
```

In a restaurant, "role" means two unrelated things: **what job you do** (kitchen / bar / floor)
and **what you may do in the app** (member / manager). A chef cannot claim a bartender's shift —
that is a domain eligibility rule keyed on job. A manager can approve — that is permission keyed
on membership. The document collapses both into one column and never distinguishes them, while
its authorization table's whole point is that role answers "which actions".

I guessed: two columns, `job` and `permission`, on `memberships`. **With more information** I would
want to know whether job belongs on the membership at all or on the shift-plus-a-skills table,
because a person who works bar on Fridays and floor on Saturdays breaks my guess immediately.

### G3 — where eligibility rules live

"Cannot claim a shift that overlaps one you already work" and "cannot claim a job you do not hold"
are not any of the three authorization patterns (ownership / role / membership) and are not
constraints the document shows how to express. I put them in a domain service behind a port. Pure
invention.

### G4 — a negative authorization rule

You may not claim **your own** offer. All three patterns in the table are positive ("does this row
carry the caller's id?" — yes means allow). Mine needs "yes means deny." I wrote it as
`Membership ∧ ¬Ownership` by analogy with the document's `Role ∧ Membership` conjunction. The
document only ever composes with *and*, never with a negation.

### G5 — idempotency for a pull, not a push

I applied the second mechanism —

> "**Make the write itself repeatable.** … Where you can phrase the change as 'set this to that'
> rather than 'adjust this by that', you need no bookkeeping at all."

— as an upsert on `(venue_id, external_ref)` for the nightly rota import. I believe this is right.
It is a transfer I made, not one the document sanctioned, and the whole idempotency section is
anchored on webhooks (see S4).

### G6 — the notification cadence number

> "'Record the intent and send later' is not a design until you say how much later, and the answer
> comes from the promise the feature made rather than from a default."

Nobody stated a promise for my product. I invented "a manager is nudged three hours before shift
start about any claim still pending." Three is a number I made up. The document's method requires
a stated promise as input and my product has none written down, which is arguably 02's job — but I
could not check.

### G7 — which table carries the timezone

> "Store it as `timestamp` without a zone plus the location's timezone (`Europe/London`, not an
> offset …)"

*Where* the location's timezone lives is not said. On the venue is the normalised answer. On the
shift is the moment-fact answer — if the venue's zone is corrected later, every historical shift
silently moves. I put it on **both**: `venues.timezone` as the source, copied onto `shifts.tz` at
creation. That is a deliberate 3NF violation I chose using the moment-fact rule, and it is exactly
the collision described in contradiction C1 below. I guessed, and I guessed by picking which of
the document's two rules to obey.

### G8 — whether `shift_offer` is an entity

Worked through in section 7 below. The strike test and the thing-or-something-that-happened
question point in opposite directions on this noun; I chose which one wins.

---

## 3. Contradictions

Two passages that cannot both be followed.

### C1 (the important one) — an invoice's shipping address, twice, with opposite verdicts

> "**Store it when it is a fact about a moment**: the tax rate applied when the invoice was sent,
> the price at the time of purchase, **the address it shipped to**. Those look derivable and are
> not, because the thing they would derive from has since changed."
> — *Model the domain first*

> "**Third normal form** — no column depending on another non-key column. Storing both `client_id`
> and `client_address` on an invoice is the violation, and it is the one the working rule above is
> really about."
> — *Design the database → Normalisation*

Same document, same example entity, same column. One says store it; the other says storing it is
the violation.

There *is* a resolution latent in the text — the `invoice_sends` table shows it:

```sql
sent_to    text NOT NULL,          -- the address at the time, not a join to the client
```

The moment-fact goes on the **event row**, not on the aggregate row. That is a clean, statable
rule. The document never states it, and the two passages that a reader will actually apply are the
two above.

**Cost to me:** I could not tick DoD box "Derived values computed; facts about a moment stored, and
the difference stated per value." For `shifts.tz` and for `claims.shift_id` (below) I have two
document-sanctioned rules pointing opposite ways and no stated tie-break.

### C2 — the tenant key must be on every table, and putting it there violates 3NF

> "The tenant key, carried on every table that holds tenant data."
> — *Actors, roles and the tenant key*

> "- [ ] Tenant axis decided — person or organisation — and the key present on every table that
> holds tenant data"
> — *Definition of done*

versus C1's 3NF definition: "no column depending on another non-key column."

My hierarchy is company → venue → shift → offer → claim. `claims.company_id` depends on
`claims.shift_id`, a non-key column. Textbook violation, and the Definition of done requires it on
five tables.

The document's own example is one level deep (`teams.company_id`, where company is the direct
parent) so the conflict never surfaces there. It surfaces on the first product with a real
hierarchy, which is most of them.

**What I needed:** one clause — "the tenant key is a deliberate denormalisation; it is the one
place third normal form loses, because a query that has to join four tables to prove a row belongs
to you is a query that will eventually forget to." I believe that is the answer. I had to write it
myself.

### C3 — "choose on one question", then don't choose on it

> "**Choose between them on one question: how much of your logic is worth testing without the
> database running?** If the answer is 'most of it' — pricing rules, eligibility, anything with
> branches you care about — hexagonal pays for its indirection."

> "Start layered and extract ports where a piece of logic gets hard to test; going the other way is
> a rewrite."

Two sentences apart. My answer to the question is emphatically "most of it" — shift-swap
**eligibility** is named in the first quote as an example of branchy logic worth testing dry, and
it is the core of my product. The first sentence says hexagonal. The second says start layered.

Also ambiguous: "going the other way is a rewrite" — going *which* way? Layered→hexagonal (which
the same sentence just recommended doing incrementally) or hexagonal→layered? I read it three times
and settled on the second reading because the first would contradict the clause before it.

I proceeded layered-with-one-extracted-port and I do not know whether that is following the
document or ignoring it.

### C4 — approval is an entity, except in every worked example of it

> "Ask whether you will later want to know **who did it and when**. If yes, it is a thing — an
> approval with an actor and a timestamp — and **modelling it as a status flip throws that away
> irreversibly** … 'Approved' is the usual case that goes both ways, and the answer is almost always
> that you will want to know."

> ```sql
> UPDATE claims SET status = 'approved', version = version + 1
>  WHERE id = $1 AND version = $2;
> ```

> ```sql
> CREATE UNIQUE INDEX one_approved_claim_per_shift
>   ON claims (shift_id) WHERE status = 'approved';
> ```

The rule says a status flip on approval throws away information irreversibly. Both worked examples
of `claims` — the optimistic-locking `UPDATE` and the partial unique index — are built on a status
flip on approval, on my exact entity.

These *can* both be true: a `status` column for the current value plus a `claim_decisions` table
for the acts. That is what I built. But the document never shows the both-version, and its only
concrete `claims` code is the shape it warned against. A reader following the code rather than the
prose ships the thing the prose forbids.

### Not a contradiction — a suspicion I disproved

I initially flagged the trace table's row "Availability | A timeout on every external call…"
against the unconditional Definition-of-done box "A timeout on every external call", and against
"For most calls the right answer is a timeout and nothing else" — i.e. the decision happens whether
or not you chose the characteristic, which would hollow out the test "a characteristic that traces
to no decision was not chosen".

The document pre-empts this, explicitly, two lines below the table:

> "Every row is a decision this stage makes anyway. Choosing the characteristic first is what turns
> that decision from a preference into something with a reason attached."

That is a complete answer and I withdraw the finding. Recording it because I nearly reported it.

---

## 4. Told me something and then didn't let me use it

### Genuinely unusable

- **Second normal form.** "On a table keyed by `(invoice_id, line_no)`, storing the client's name
  is the violation." Every schema the document teaches uses `id uuid PRIMARY KEY
  DEFAULT gen_random_uuid()`. With a surrogate single-column key, no column can depend on *part* of
  the key, so 2NF is unviolatable by construction. In my whole schema exactly one table has a
  composite key (`memberships`, copied from the document's own shape), and it has no extra columns
  to violate with. **Checking 2NF was a null operation.** The document teaches uuid PKs and 2NF on
  the same page and never says the first makes the second vacuous.

- **The archive table** as a soft-delete mechanic. "An **archive table** earns its place when volume
  is the problem rather than history." Volume is discussed in exactly one place — the capacity
  number in *Indexes* — and the two are never joined. I have a volume number (below). Nothing tells
  me at what number an archive table starts earning its place, so the mechanic is named and
  unpickable.

- **Event-driven, promised and not delivered.** "**event-driven** means components announce that
  something happened rather than calling the next step directly. It is not a deployment shape — a
  single application can be event-driven internally. **The decision that leads here is posed in
  'Sketch the system' below, where it is concrete.**" *Sketch the system* poses synchronous vs
  asynchronous **for external calls only** — a webhook you receive, an email you send. It never
  returns to the internal case the forward reference promised. I have a real internal candidate
  (approving a claim should update the roster, notify two staff, and cancel sibling claims) and no
  guidance on whether that should be a direct call chain or an internal event.

- **Hexagonal / ports.** Defined, given a selection test, and then not used — the document's own
  recommendation is "start layered", so no example anywhere in the stage shows what a port looks
  like. Combined with C3, I could not tell whether my one extracted eligibility port was correctly
  shaped.

- **Component diagram (C4 level 3).** "Component is worth drawing for the one subsystem complicated
  enough that you keep re-deriving how it fits together." Never shown, and the Artifacts list does
  not ask for it. My claim-approval flow is exactly "the one subsystem complicated enough", and I
  had no example to imitate.

### Honestly signposted, not a defect

The document flags these itself and I want to credit that rather than count them:

- **Bulkhead** — "named and not taught". Explicit.
- **CAP** — "With one database there is no partition to survive, so it is theory." Explicit, and
  the read-after-write anomaly is given as the part that will actually bite.
- **Read committed vs serializable** — defined and then immediately declared *not* the fix for the
  lost update. That refusal is the most useful paragraph in the section.
- **Fitness functions** — "**Not now, though.**" Explicit deferral to 06 with reasons. (The gap is
  the missing examples, S1, not the deferral.)
- **Strangler fig** — a deferral technique, correctly given as a name plus a shape.

### Applied well, worth naming

- **Statelessness** is defined once and then used three times, in three different sections, to
  decide three different things: whether serverless is available, whether staff keep working when
  the auth provider is down, and why an in-memory circuit breaker trips ten times later than
  designed. That is a term earning its keep.
- **Ubiquitous language.** "the table is called `claims` because the people who use the system say
  'claim'." My users say claim. I named the table `claims`. The rule was applied to my product by
  the document itself.

---

## 5. Definition-of-done walk, box by box

| # | Box | Tick? | Why |
|---|---|---|---|
| 1 | Characteristics chosen, each traced to a decision it forced | **Yes** | Three, each traced. Trace table did the work. |
| 2 | Architecture style named, alternatives rejected with reasons | **Yes** | Four-row table gave me the alternatives and the "what would have to be true" column gave me the rejection reason for each. |
| 3 | System sketched, with what happens when each external dependency is down | **Partial** | Answered for auth, email, push. Not for the scheduler, the database, or the rota import — see S3/S4. |
| 4 | Integration style decided per external call, anything received is idempotent | **Yes**, with G5 | The pull-based import is idempotent because I transferred the mechanism, not because the text covered it. |
| 5 | A timeout on every external call, and a stated answer for each dependency down | **Yes** | "The specific number matters much less than having one" is a good enough licence to pick 3s/5s/10s. |
| 6 | Concurrent-edit strategy where two people can act on one row | **Yes — the strongest box in the list** | See section 11. |
| 7 | Each characteristic has one line on how you'd know it stopped holding | **No** | Blocked by S1 for two of three. |
| 8 | Domain modeled in nouns and relationships, not tables | **Yes** | |
| 9 | Derived values computed; facts about a moment stored, difference stated per value | **No** | Blocked by C1. I cannot state the difference for `shifts.tz` or `claims.shift_id` without picking which of two rules wins. |
| 10 | Deletion behavior decided per entity | **Yes** | "cancelled bookings, withdrawn requests, and users who left" names my three cases directly. |
| 11 | Uniqueness constraints scoped correctly | **Yes** | `UNIQUE (company_id, name)` on venues, `UNIQUE (offer_id, claimed_by)` on claims. The "two companies may both have a team called Kitchen" line is a restaurant example and landed immediately. |
| 12 | Constraints live in the database, not only in application code | **Yes** | |
| 13 | Tenant axis decided, key present on every table that holds tenant data | **Half** | Axis: yes, decided cleanly (company). "Every table": ticked only by accepting C2's 3NF violation knowingly. |
| 14 | Conditional rules as partial unique indexes, not check-then-insert | **Yes**, after deriving one thing the document does not join up (section 9) | |
| 15 | Any change to stored data on a system with users planned as expand-contract | **Vacuously yes** | "If nobody is using the system yet — pre-launch, four test users, one instance — renaming a column *is* one statement." The box is scoped "on a system with users" and I have none. This scoping is a genuinely good piece of writing. |
| 16 | Indexes added for the queries you actually run, and no others | **Tension** | My capacity number says no index is load-bearing (section 6). Ticked with two indexes and a note that by the document's own yardstick the honest number might be zero. |
| 17 | API contracts decided, sorted by how expensive each is to change | **Yes** | Everything in row one; nothing in rows two and three; the item that would move first is the manager approval action, if the chain ever wants a mobile app. That "value is noticing you have nothing in rows two and three yet" line is the reason the exercise was worth thirty seconds. |
| 18 | Auth strategy chosen, with an ADR | **Yes** | Auth.js + Postgres adapter. Counted as one ADR by the stated rule. |
| 19 | Authorization rule per entity, including where two patterns must both hold | **Yes** | Six entities, three needing conjunctions. Two rules of mine have no home in the three patterns (G3, G4). |
| 20 | Feature boundaries defined, with the no-cross-querying rule stated | **Yes** | And "Approving a shift swap changes rows the approval flow does not own" is my product, worked. |
| 21 | Every expensive decision has an ADR | **Yes** | Twelve, by the one-per-independently-reversible-thing rule. |
| 22 | Deferred decisions listed explicitly | **Yes** | |

**18 clean, 1 vacuous, 2 partial, 2 no.**

---

## 6. The capacity number

> "**First, one number: how much data will exist in a year, and how fast does it arrive?** Not a
> model — a number you can say out loud."

My number, said out loud:

> One restaurant, 45 staff, about 2 shifts each per week. About **4,700 shifts a year**. Roughly
> 8% get offered for swap, so **~380 offers**, averaging 2 claims each, so **~800 claims** and
> **~800 decision rows**. Under **7,000 rows a year across the whole schema**, arriving at about
> **12 writes a day**.

**Did the text give me enough to know what the number is for?** Partly, and less than it looks.

What it gives me: "Ten thousand invoices is a table where every query is fast and no index is
load-bearing; ten million is a table where the missing one is an outage." My number sits an order
of magnitude *below* its small case. So the number told me something real and slightly awkward —
**by the document's own yardstick, neither of my two indexes is load-bearing and the honest answer
to box 16 might be zero indexes.** I kept them because they trace to real queries, which the same
section demands. The number and the index rule pull in different directions at small scale and the
document does not say which wins.

What it does not give me: the number is asked in one subsection and consumed in that same
subsection. It has no other consumer. Three places where it *obviously* should feed something and
does not —

- **The characteristics section, 650 lines earlier**, declines scale with "there is no evidence of
  it and inventing some is the trap below." I needed the number *there*, to decline scale honestly.
  It is requested here.
- **The connection-pooler sharp edge** turns on concurrency. My 12 writes a day makes the pooler a
  formality; someone else's number makes it urgent. Never joined.
- **The backfill batch size** — "the number only matters on tables big enough that you would
  notice." That *is* the capacity number, and the sentence does not say so.

So: I produced the number, and I know what it is for in one place only. It reads as a local rule
inside *Indexes* rather than as the single fact the whole low-level design should be calibrated
against, which is what it actually is.

---

## 7. The strike test on three of my nouns

> "**The test that generalises, because one example is not a rule: would you ever need to point at
> this on its own?** An entity has an identity you refer to later — you fetch it, link to it,
> attach something to it. A property only ever describes the row it sits on."

**Noun 1 — `reason` (why I can't work this shift).** Would I point at it on its own? No. It only
describes the offer it sits on. Nobody fetches a reason or attaches anything to it. → **Property.**
The rule decided it, cleanly, in one pass.

**Noun 2 — `claim`.** I fetch it, a manager approves *this claim*, a decision row attaches to it,
it appears in a list. → **Entity.** The rule decided it, cleanly.

**Noun 3 — `shift_offer` (the posting itself). Genuinely borderline, and the rule did not decide
it — I did.**

The two tests the document gives disagree on this noun.

The strike test's own worked precedent points to *property*:

> "A shipping address on an order is the harder case and the same answer: **it is columns**, until
> somebody wants to reuse it across orders or ship to it from an address book, at which point it
> acquires an identity"

By that reasoning, "offered for swap" is a state a shift is in — `shifts.offered_at`,
`shifts.offer_reason` — until someone wants to reuse an offer, which nobody does. Columns.

The thing-or-something-that-happened test points to *entity*:

> "Ask whether you will later want to know **who did it and when**. If yes, it is a thing … and
> modelling it as a status flip throws that away irreversibly"

Do I want to know who posted a shift for swap and when? Yes — and whether they posted it, withdrew
it, and posted it again the next day, which is a pattern a manager cares about.

Both tests are in the same section, both apply to this noun, and the document does not say which
takes precedence when they disagree. I chose the second, because its "almost always" is more
emphatic than the first's "harder case". **That is me deciding, not the rule deciding.**

And the sub-question neither test reaches: if an offer is withdrawn and re-posted, is that a second
row in `shift_offers` or a status flip back to `open` on the first? Both preserve who-and-when if I
also have a decision log. The document's entity/property axis has nothing to say about
cardinality-over-time, and my partial unique index (`one_open_offer_per_shift`) only works if I
pick the multi-row answer. I picked it for that reason — a schema-tool reason, not a
domain-modelling reason.

**A fourth noun worth flagging:** there is no `swaps` table in my schema. The product is called a
shift-swap app and "swap" turns out to be the *composition* of an offer, a claim and a decision,
with no identity of its own. The strike test caught that, and it is the kind of thing I would
otherwise have modelled as a table because it is in the product's name. Credit where due.

**Also unreachable by the strike test:** "roster". Would I point at "the roster for the week of
10 August" on its own? Arguably yes — a manager publishes it, locks it. But it holds no data of
its own; it is a query over shifts. The compute-versus-store rule that would resolve this is
scoped to *values* ("Compute it when it is a pure function of data you already hold"), and I had
to stretch it to a *collection noun* to get an answer. It stretched fine. It was a stretch.

---

## 8. The backfill loop against my own schema

**The change:** I originally stored shift times as `timestamptz`. Reading the third timezone case
told me that is wrong for a schedule —

> "A shift that starts at 09:00 on Tuesday starts at 09:00 whatever the clocks do — it is a
> *wall-clock* fact attached to a place, not an instant. Store it as an instant and it moves by an
> hour twice a year"

— so `shifts.starts_at timestamptz` must become `starts_at_local timestamp` + `tz text`.

**The expand-contract sequence**, straight off the six-step list:

```
1. Expand    add starts_at_local, ends_at_local (timestamp, nullable) and tz (text, nullable)
2. Write     write all five columns on every save. Deploy. Wait for the rollover to finish.
3. Backfill  the loop below, in batches, skipping anything step 2 already wrote
4. Move      rosters, the swap board and the reminder sweep read the local columns. Deploy. Watch.
5. Stop      stop writing starts_at / ends_at. Deploy.
6. Contract  drop them; SET NOT NULL on the new three via NOT VALID → VALIDATE → SET NOT NULL
```

**The loop I would actually run:**

```sql
-- Repeat until it reports zero rows. Safe to re-run at any point.
UPDATE shifts s
   SET starts_at_local = (s.starts_at AT TIME ZONE v.timezone),
       ends_at_local   = (s.ends_at   AT TIME ZONE v.timezone),
       tz              = v.timezone
  FROM venues v
 WHERE s.venue_id = v.id
   AND s.id IN (
     SELECT id FROM shifts
      WHERE starts_at_local IS NULL      -- never overwrite what step 2 wrote
        AND starts_at IS NOT NULL        -- or the loop never reaches zero rows
      ORDER BY id
      LIMIT 1000                         -- one batch
   );
```

Driven by: run it, read the row count, run again until zero. Both guards are the document's, ported
one-for-one, and I understood *why* each is there because the document explains both failures
rather than just showing the guards.

**Could I write this from the text alone? Mostly yes — with three gaps.**

Given by the text, and load-bearing:
- the six steps, and specifically *why* steps 2 and 5 are separate deploys ("A deploy is not a
  moment, it is a rollover")
- both guards, with the exact failure each prevents — the non-terminating loop and the silently
  reverted correction
- "Run the `SELECT` half first and look at what comes back before you let the `UPDATE` touch
  anything." I did. It found 40 shifts imported before the venue had a timezone set.
- the driver loop, key-ordered rather than `OFFSET`
- batch size as a judgement, with 1000 as a start
- the `NOT VALID` → `VALIDATE` → `SET NOT NULL` route for step 6

**Gap 1 — a dependent backfill.** My backfill reads `venues.timezone`, which does not exist yet
either. So this is actually *two* expand-contract sequences that must run in order: venues first,
shifts second, and the shifts backfill must not start until the venues one reports zero. The
document's loop is single-table and says nothing about ordering dependent backfills or about what
happens when the source of your fill values is itself being backfilled. This is not exotic — any
column-split that reads a lookup table hits it.

**Gap 2 — the null-source case has no answer.** Those 40 shifts have no venue timezone. The
`name IS NOT NULL` guard's logic says exclude them or the loop never terminates. But excluding them
means they are never migrated, and step 6 drops the old column, and their times are gone. The
document teaches "the data you are migrating contains cases your splitting rule was not written
for" — which is exactly right and is how I found them — but the only remedy it models is *skip
them*, and skipping is data loss when a contract step follows.

**Gap 3 — `AT TIME ZONE`.** The document tells me to store wall-clock plus zone and never shows the
conversion in either direction. It uses `split_part`, `strpos` and `substr` without introducing
them, so assuming SQL fluency is consistent — but the timezone case is the one it introduces as new
and surprising ("Most products only have the first two and never notice the third exists until a
scheduling feature arrives"), and it is the one where the reader most needs the two-line worked
conversion.

---

## 9. Soft delete: which mechanic, and what I would build

> "**There are three mechanics, and the DDL above shows one.** A nullable `deleted_at` timestamp is
> the default … A **status enum** with a `deleted` member is the common alternative and usually the
> wrong one … An **archive table** earns its place when volume is the problem rather than history"

**My choice: nullable `deleted_at` on `shifts`, `shift_offers` and `claims`.** Hard delete on
nothing except `processed_events`.

The choice was made for me by the heuristic, which names my product's rows:

> "keep anything somebody will later ask 'where did that go?' about. Financial records obviously,
> but also **cancelled bookings, withdrawn requests, and users who left**"

A withdrawn swap request is on that list literally. And the archive-table option is ruled out by my
capacity number — 7,000 rows a year is not a volume problem — while the status-enum option is ruled
out by the document's own reasoning, which happens to be exactly right for me: my claims already
have a lifecycle (`pending / approved / rejected / withdrawn`) and I need "deleted, and previously
approved" to stay expressible when a manager asks what happened to last Tuesday.

**The structural filter I would build:**

> "Discipline is not the mechanism. Put the filter somewhere structural: **a view the application
> reads instead of the table**, or a single accessor every query goes through."

I would build the view, one per soft-deleted table, and never name the base table in a read:

```sql
CREATE VIEW live_shifts       AS SELECT * FROM shifts       WHERE deleted_at IS NULL;
CREATE VIEW live_shift_offers AS SELECT * FROM shift_offers WHERE deleted_at IS NULL;
CREATE VIEW live_claims       AS SELECT * FROM claims       WHERE deleted_at IS NULL;
```

Writes go to the base tables; reads go to the views. And the fitness-function line for auditability
becomes checkable after all: **a test that fails if any read path references a base table by name.**
That plugs the soft-delete mechanic into the fitness-function idea from 400 lines earlier, and the
document does not connect them — but it left both ends exposed and the join was mine to make.

**The one thing I had to derive, and the document should say it.** Soft delete and the partial
unique index collide, and the document teaches both and never puts them in the same sentence. Its
own example is:

```sql
CREATE UNIQUE INDEX one_approved_claim_per_shift
  ON claims (shift_id) WHERE status = 'approved';
```

A soft-deleted approved claim **still occupies the uniqueness slot.** A manager approves the wrong
person, soft-deletes the claim, and now nobody can be approved for that shift — the constraint
holds against a row that no query can see. The fix is one clause:

```sql
CREATE UNIQUE INDEX one_approved_claim_per_shift
  ON claims (shift_id) WHERE status = 'approved' AND deleted_at IS NULL;
```

I found this by writing the schema, not by reading. Every partial unique index in a soft-deleting
schema needs that clause, and this is the highest-value single sentence the section is missing.

---

## 10. External dependencies: mine versus the diagram's set

**The diagram's set:** payment provider (Stripe), auth provider, email, blob storage, Postgres,
scheduled job. Four get a down-case answer.

**Mine:**

| # | Dependency | In the diagram's set? | Did the down-case list help? |
|---|---|---|---|
| 1 | Auth provider | Yes | **Yes, completely.** "a session in a cookie or a shared store outlives the provider being unreachable" gave me the answer and the reason. Best transfer in the section. |
| 2 | Email (approval confirmations, weekly roster) | Yes | **Yes.** "Either retry, or record the intent and send later" + the cadence paragraph. |
| 3 | **Push / SMS provider** | **No** | **Partly.** No box, no down-case template — but the cadence paragraph ("wrong for a shift confirmed at 9pm for 6am") is written *about my product* and gave me the reasoning tool even though the diagram gave me no place to draw it. This is the dependency that matters most to me and it is missing from the picture while being present in the prose. |
| 4 | **The restaurant's existing rota system** (shifts imported from it) | **No** | **No.** See S4. There is no category for an inbound dependency that is not a webhook, and it is arguably the source of truth for my largest table. |
| 5 | Scheduled job (the pending-claim nudge) | Yes, as a box | **No.** Its box is drawn and exempted from "for each box that is not yours". See S3. A missed sweep is a no-show at 6am. |
| 6 | Postgres | Yes, as a box | **No.** No down-case for the database either. |
| 7 | Blob storage | Yes | N/A — I have none. |
| 8 | Payment provider | Yes | N/A — I have none. |

**Two of its four externals do not apply to me. Two of mine are missing from it, and two more of
its own boxes are exempt from its own question.** So: three of my six real dependencies got a
usable down-case answer.

The *method* transfers — "for each box that is not yours, what happens when it is down" is the
right question and drawing the diagram is what produced my list. The *set* is invoicing-shaped, and
the document does not say so at the point where I would be checking my list against it. The
"worked examples, not the answer for your system" caveat exists in the document, but it is in
*Sort decisions by reversibility*, 500 lines earlier, attached to a different list.

The most useful line for me was in the AI section, not the sketch section:

> "**Find the box you left out of the sketch.** Paste the container view and ask what a system like
> this usually talks to that is missing."

That is the procedure for exactly the problem the diagram's fixed set creates, and it is filed
under tooling rather than under drawing.

---

## 11. Three normal forms against my own schema

> "if changing one fact means updating two rows, the model is wrong."

**First normal form — I found a violation in my own first draft.**

I had written `shifts.roles_required text[]` — a bar shift needs `{bar}`, a busy Saturday service
needs `{bar,floor}`. That is precisely the named violation:

> "A list of tags in a `tags` column is the violation, and it is the one that looks harmless until
> you have to query it."

And it *does* look harmless until the query, which for me is "show me open offers I am eligible
for" — an array containment check against the claimant's job, on every board load. Replaced with a
single `shifts.job` column plus, later if needed, a `shift_role_requirements` join table. **Caught
by the document, not by me.** This is the clearest single win of the run.

**Second normal form — a null operation, and I do not think that is my fault.** See section 4. Every
table in my schema except `memberships` has a surrogate uuid primary key, following the document's
own DDL, and 2NF requires a composite key to be violable. `memberships (user_id, venue_id)` is my
only composite key and carries `permission` and `job`, both of which depend on the whole key. No
violation available to find.

**Third normal form — two violations, both of which I kept deliberately, and the document is why
in both directions.**

1. `claims.shift_id`, alongside `claims.offer_id`. `shift_id` depends on `offer_id`, a non-key
   column. Textbook 3NF violation. **I kept it because the document's own cross-row-invariant tool
   requires it** — `one_approved_claim_per_shift` indexes `claims (shift_id)`, and a claim only
   knows its shift by joining through the offer. So the partial unique index, which the Definition
   of done mandates, forces a 3NF violation on any invariant whose scope is more than one hop away.
   That is the same structural collision as C2, arrived at from a different direction.

2. `shifts.tz`, copied from `venues.timezone`. 3NF says violation; "store it when it is a fact about
   a moment" says store it. C1 in miniature. Kept, on the moment-fact reading, without confidence.

So: **one real violation found and fixed (1NF), one form that could not be checked (2NF), and two
3NF violations that the document's other rules require me to commit.** The working rule — "if
changing one fact means updating two rows, the model is wrong" — is the part that actually did
work; the three named forms produced one hit, one blank, and two conflicts.

---

## 12. What I could complete unaided

All ten artifacts, at the detail below. Reproduced compactly because the point of the run is that
they exist.

**Characteristics (3).** Correctness — two people must never both be approved for one shift, and
the roster must never disagree with itself. Auditability — "I never agreed to cover that" is a
labour dispute and the answer has to survive. Cheap to run — one restaurant is paying for this.
Declined out loud: availability (a failed swap falls back to a phone call, which the restaurant
already has), latency, scalability, evolvability.

**Style.** Single Next.js application, one Postgres database, modular monolith, layered internally
with one extracted eligibility port. Rejected: microservices (benefits are organisational and I am
one person); serverless-as-architecture (a deployment detail, and it brings the connection-limit
edge, so: pooler in transaction mode, nothing relying on session state outside a transaction);
plain non-modular monolith (I expect this to outlive my first guess at its shape).

**Tenant axis.** Organisation. The rule decided it outright — "the tenant key is the level at which
data stops being shared. If a worker moving between teams should keep their history, the company is
the tenant" — and my staff move between the bar and the floor, and between venues if the owner opens
a second site. `company_id` is the key; `venue_id` is an ordinary foreign key. This is one of the
best passages in the stage: a question I would not have known to ask, with a rule sharp enough to
answer it, and a named consequence for getting it wrong.

**Domain model, in nouns.**

```
A Company has many Venues.
A Venue has many Shifts and many Memberships.
A User has many Memberships; a Membership carries a job and a permission, per venue.
A Shift is assigned to one User and has a wall-clock start and end in the venue's zone.
A Shift may have many ShiftOffers over time; at most one open at once.
A ShiftOffer has many Claims; at most one approved per Shift.
A Claim has many ClaimDecisions (append-only, with an actor and a timestamp).
"Eligible", "open" and "covered" are computed, never stored.
```

**Schema** (abridged; constraints are the point).

```sql
CREATE TABLE venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  name text NOT NULL,
  timezone text NOT NULL,                       -- IANA name, not an offset
  UNIQUE (company_id, name)
);

CREATE TABLE memberships (
  user_id    uuid NOT NULL REFERENCES users(id)  ON DELETE RESTRICT,
  venue_id   uuid NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
  permission text NOT NULL CHECK (permission IN ('member','manager')),
  job        text NOT NULL CHECK (job IN ('kitchen','bar','floor')),
  PRIMARY KEY (user_id, venue_id)
);

CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,  -- tenant key
  venue_id        uuid NOT NULL REFERENCES venues(id)    ON DELETE RESTRICT,
  assigned_to     uuid          REFERENCES users(id)     ON DELETE RESTRICT,
  job             text NOT NULL CHECK (job IN ('kitchen','bar','floor')),
  starts_at_local timestamp NOT NULL,           -- wall-clock, per the third case
  ends_at_local   timestamp NOT NULL,
  tz              text NOT NULL,                -- the zone at the time; see C1
  external_ref    text,                         -- id in the rota system, if imported
  version         integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  CHECK (ends_at_local > starts_at_local),
  UNIQUE (venue_id, external_ref)               -- makes the nightly import idempotent
);

CREATE TABLE shift_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  shift_id   uuid NOT NULL REFERENCES shifts(id)    ON DELETE RESTRICT,
  offered_by uuid NOT NULL REFERENCES users(id)     ON DELETE RESTRICT,
  reason     text,
  status     text NOT NULL CHECK (status IN ('open','withdrawn','filled')),
  version    integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE UNIQUE INDEX one_open_offer_per_shift ON shift_offers (shift_id)
  WHERE status = 'open' AND deleted_at IS NULL;

CREATE TABLE claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id)    ON DELETE RESTRICT,
  offer_id   uuid NOT NULL REFERENCES shift_offers(id) ON DELETE RESTRICT,
  shift_id   uuid NOT NULL REFERENCES shifts(id)       ON DELETE RESTRICT,  -- 3NF violation, forced
  claimed_by uuid NOT NULL REFERENCES users(id)        ON DELETE RESTRICT,
  status     text NOT NULL CHECK (status IN ('pending','approved','rejected','withdrawn')),
  version    integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (offer_id, claimed_by)
);
CREATE UNIQUE INDEX one_approved_claim_per_shift ON claims (shift_id)
  WHERE status = 'approved' AND deleted_at IS NULL;   -- the deleted_at clause is mine, see §9

CREATE TABLE claim_decisions (                        -- append-only, never updated
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id   uuid NOT NULL REFERENCES claims(id) ON DELETE RESTRICT,
  decided_by uuid NOT NULL REFERENCES users(id)  ON DELETE RESTRICT,
  decision   text NOT NULL CHECK (decision IN ('approved','rejected')),
  note       text,
  decided_at timestamptz NOT NULL DEFAULT now()
);
```

**Indexes, each traced to a query.**

```sql
-- The swap board: open offers at my venue, next 14 days.
CREATE INDEX shifts_venue_start_idx ON shifts (venue_id, starts_at_local)
  WHERE deleted_at IS NULL;

-- The manager's queue, and the scheduled nudge: claims still pending.
CREATE INDEX claims_pending_idx ON claims (company_id, created_at)
  WHERE status = 'pending' AND deleted_at IS NULL;
```

Noted against box 16: my capacity number says neither is load-bearing yet.

**Concurrency.** Optimistic locking (`version`) on `claims` and `shifts`, because a human sits
between the read and the write — "For anything with a human deciding in the middle, that is almost
always optimistic." Zero rows updated → "somebody got there first." The cross-row case (two
managers approving two *different* claims on the same shift) is caught by
`one_approved_claim_per_shift`, and the violation is caught by constraint name and turned into the
same message. **This section is the best-taught thing in the stage** — it names the trap, disproves
the fix a reader would reach for (`SERIALIZABLE`), separates the row case from the cross-row case,
and closes the loop on the error handling. It also happens to use my exact product as its example.

**Authorization, per entity.**

```
Shift        read   → Membership
             write  → Role ∧ Membership          (manager of the venue)
ShiftOffer   create → Ownership ∧ Membership     (only your own shift)
             read   → Membership
             withdraw → Ownership
Claim        create → Membership ∧ ¬Ownership(offer) ∧ job-eligibility     [¬ and eligibility: mine]
             approve → Role ∧ Membership         (the document's own worked conjunction)
ClaimDecision create → Role ∧ Membership
Membership   write  → Role ∧ Membership
```

**Contracts, sorted.** Row one (cheap, internal): `postOffer`, `withdrawOffer`, `claimOffer`,
`withdrawClaim`, `decideClaim`, `importRoster`. Row two (expensive, public): empty — and noticing
that is the point. Row three (not mine): the auth provider's user-deleted webhook, and the rota
system's shape if it ever pushes instead of being pulled. Verb routes as sub-resources,
`POST /claims/:id/decisions` — resolved by the tie-break "if you would want to know later who
approved what and when, the verb was an entity all along."

**ADRs (12),** one per independently reversible thing per the stated rule: one app + Postgres
modular monolith · Postgres as the store · Auth.js with a Postgres adapter (one, not two) · uuid
primary keys · tenant axis = company · wall-clock shift times · soft delete via `deleted_at` read
through views · optimistic locking · approval as an entity beside the status column · no queue, no
cache, no event bus · pooler in transaction mode · **no deployment view** (recorded as a decision,
per "A view you decided not to draw and a view you forgot look identical on the page and mean
opposite things about your thinking" — a line worth the whole subsection).

**Deferred, explicitly:** cache · queue · event sourcing · CQRS · design system · feature-flag
infrastructure · invitations · per-tenant settings and billing · public API · route versioning ·
circuit breakers.

---

## What made the good parts good

Naming these plainly, because a report that only finds problems is not an accurate one.

1. **The document teaches the reader to disprove things, then does it.** `SERIALIZABLE` is
   introduced and then shown *not* to solve the lost update. Optimistic locking is shown and then
   shown *not* to catch the cross-row case. Each refusal is more useful than the technique it
   refuses, and it is the pattern I would keep above everything else here.
2. **Rules that decide.** "The tenant key is the level at which data stops being shared" and
   "optimistic when conflict is rare, pessimistic when it is expected" both resolved my case in one
   pass without me supplying judgement.
3. **The failure explained, not just the guard.** The backfill's two guards come with the exact
   silent failure each prevents. I understood that loop rather than copying it, and that is why I
   noticed the two things it does not cover.
4. **Refusals that scope a box.** "on a system with users" on the expand-contract box, and
   "**Not now, though.**" on fitness functions. Both told me a box did not apply to me and why,
   which is the difference between an honest tick and a lie.
5. **It uses my product.** Shift swaps, claims, kitchen teams and managers appear throughout, which
   meant several rules arrived pre-applied. The cost of that is that the *diagram* is still
   invoicing-shaped, and the mismatch between the prose knowing about shift swaps and the sketch
   not knowing about push notifications is where several of my findings sit.
