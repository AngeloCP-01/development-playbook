import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import {
  C4_LEVELS,
  FLOW_STEPS,
  PROCESSED_EVENTS_LINES,
  RESILIENCE_PATTERNS,
  SKETCH_CAPTION,
  SKETCH_INTRO,
  SKETCH_NODES,
  SKETCH_PAYOFF,
  SYNC_ASYNC_ROWS,
  SYNC_ASYNC_RULE,
} from './sketch'

const WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
]

// The whole return on drawing the sketch is the question it forces: for each
// box that is not yours, what happens when it is down? A node that ships with
// a description and no failure mode is the failure this component exists to
// stop, so it fails here rather than in review.
test('every external system answers what happens when it is down, which is the only reason the diagram pays for itself', () => {
  for (const n of SKETCH_NODES) {
    if (n.kind !== 'external') continue
    expect(
      n.whenDown?.trim().length ?? 0,
      `${n.id} has no failure answer`,
    ).toBeGreaterThan(0)
  }
})

// Three separate sentences — the panel's opening line, its closing line, and
// the figure caption — each quoted a hand-counted "six boxes" while the
// diagram rendered eight, and the closing line called all six "not yours" in
// the same breath as explaining that one of them gets skipped *because* it is
// yours. Hand-counted prose about a list is drift waiting to happen, so the
// sentences live in the data file beside the list and the counts are checked
// against it.
test('the sentences around the sketch count the boxes the diagram actually renders, since a hand-counted number drifts the moment a node is added', () => {
  const total = WORDS[SKETCH_NODES.length]
  const external =
    WORDS[SKETCH_NODES.filter((n) => n.kind === 'external').length]
  const downCases = WORDS[SKETCH_NODES.filter((n) => n.whenDown?.trim()).length]

  expect(SKETCH_INTRO.toLowerCase(), 'intro miscounts').toContain(
    `${external} of these ${total} boxes`,
  )
  expect(SKETCH_CAPTION.toLowerCase(), 'caption miscounts').toContain(
    `${external} of the ${total} boxes`,
  )
  expect(SKETCH_PAYOFF.toLowerCase(), 'payoff miscounts').toContain(
    `${downCases} questions, ${downCases} answers`,
  )
})

// The doc's own payoff line is the source. The port had drifted into calling
// the database and the scheduled job "not yours", which contradicts the two
// skipped-box explanations in the same sentence.
test('the payoff line reads the same in the doc and the port, since this is the sentence that contradicted itself', () => {
  const md = readFileSync(
    fileURLToPath(
      new URL('../../../../docs/03-architecture.md', import.meta.url),
    ),
    'utf8',
  )
  const plain = (s: string) =>
    s.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim()
  expect(plain(md)).toContain(plain(SKETCH_PAYOFF))
})

test('there are four external systems, and six boxes with a down-case — the two extra being your own database and your own job, which is why they get skipped', () => {
  expect(SKETCH_NODES.filter((n) => n.kind === 'external')).toHaveLength(4)
  const notYours = SKETCH_NODES.filter(
    (n) => n.kind !== 'yours' && n.kind !== 'actor',
  )
  expect(notYours).toHaveLength(6)
  for (const n of notYours) {
    expect(
      n.whenDown?.trim().length ?? 0,
      `${n.id} has no down-case`,
    ).toBeGreaterThan(0)
  }
})

// The sentence that motivates the whole section enumerates what the system does
// beyond your code, and the reader takes it as the list. It named four things
// against a diagram that draws five, and the missing one was auth — added to
// the sketch in a later round without the sentence being revisited. A reader
// who is told the list and then shown a longer one distrusts the shorter.
test('the sentence that motivates the sketch names every box the diagram then draws, since the reader takes that sentence as the list', () => {
  const md = readFileSync(
    fileURLToPath(
      new URL('../../../../docs/03-architecture.md', import.meta.url),
    ),
    'utf8',
  )
  const start = md.indexOf('Your system is not.')
  const end = md.indexOf('None of those', start)
  expect(start, 'the motivating claim has been reworded away').toBeGreaterThan(
    0,
  )
  expect(end, 'the sentence after it has been reworded away').toBeGreaterThan(
    start,
  )
  const sentence = md.slice(start, end)
  // What each box contributes to that sentence. The application and the user
  // are not in it by design — the sentence is about what your system does that
  // is not your code.
  const CONTRIBUTION: Record<string, RegExp> = {
    payments: /payment/i,
    email: /email/i,
    blob: /PDF/i,
    auth: /signs? .*in|authenticat/i,
    scheduled: /due date|overdue/i,
    postgres: /store|hold|row/i,
  }
  for (const n of SKETCH_NODES) {
    const want = CONTRIBUTION[n.id]
    if (!want) continue
    expect(sentence, `${n.id} is drawn but not in the sentence`).toMatch(want)
  }
})

// A blank line between two items of the down-case list makes it a loose list,
// so markdown wraps every item in a paragraph and the one bullet after the gap
// renders with different spacing from the six above it.
test('the down-case list has no blank line between its items, since one gap re-spaces the whole list', () => {
  const md = readFileSync(
    fileURLToPath(
      new URL('../../../../docs/03-architecture.md', import.meta.url),
    ),
    'utf8',
  )
  const start = md.indexOf('- **Payment provider down**')
  const end = md.indexOf('Six questions, six answers', start)
  expect(start, 'the list has been reworded away').toBeGreaterThan(0)
  expect(end, 'the payoff line has been reworded away').toBeGreaterThan(start)
  const section = md.slice(start, end)
  expect(section, 'blank line inside the list').not.toMatch(/\n\n- \*\*/)
})

test('the sketch is more than the application and its database, which is the objection the section answers', () => {
  expect(SKETCH_NODES.length).toBeGreaterThan(3)
})

test('every node says what it does and how it connects, so no box is unexplained', () => {
  for (const n of SKETCH_NODES) {
    expect(n.does.trim().length, `${n.id} does`).toBeGreaterThan(0)
    expect(n.edge.trim().length, `${n.id} edge`).toBeGreaterThan(0)
  }
})

test('node ids are unique, since selection is keyed by id', () => {
  expect(new Set(SKETCH_NODES.map((n) => n.id)).size).toBe(SKETCH_NODES.length)
})

test('C4 has four levels and two of them are worth drawing, which is the advice rather than the trivia', () => {
  expect(C4_LEVELS).toHaveLength(4)
  expect(C4_LEVELS.filter((l) => l.draw)).toHaveLength(2)
})

test('the drawn levels are context and container, not the two below them', () => {
  expect(C4_LEVELS.filter((l) => l.draw).map((l) => l.id)).toEqual([
    'context',
    'container',
  ])
})

test('the flow runs five numbered steps in order, because it is drawn end to end or it is not drawn', () => {
  expect(FLOW_STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4, 5])
})

test('the flow crosses both integration styles, which is what makes it the flow worth picking', () => {
  const kinds = new Set(FLOW_STEPS.map((s) => s.kind))
  expect(kinds).toContain('sync')
  expect(kinds).toContain('async')
})

// "Receive" also describes a synchronous request somebody makes to you, which
// you very much do get to choose the shape of. The property that removes the
// choice is that it is pushed at you on somebody else's schedule — so the doc
// says "pushed at", and the port said "receive" in two places.
test('the rule that catches people reads the same in the doc and the port, since “receive” also describes a synchronous request', () => {
  const md = readFileSync(
    fileURLToPath(
      new URL('../../../../docs/03-architecture.md', import.meta.url),
    ),
    'utf8',
  )
  expect(md.toLowerCase()).toContain(SYNC_ASYNC_RULE.toLowerCase())
  for (const file of ['./SyncAsync.tsx', './Architecture.tsx']) {
    const src = readFileSync(
      fileURLToPath(new URL(file, import.meta.url)),
      'utf8',
    )
    expect(
      src,
      `${file} restates the rule instead of importing it`,
    ).not.toMatch(/you (?:receive|get)[^,]*, you do not get to choose/i)
    expect(src, `${file} does not use the rule`).toContain('SYNC_ASYNC_RULE')
  }
})

test('the sync/async comparison answers four questions on both sides', () => {
  expect(SYNC_ASYNC_ROWS).toHaveLength(4)
  for (const r of SYNC_ASYNC_ROWS) {
    expect(r.sync.trim().length, `${r.id} sync`).toBeGreaterThan(0)
    expect(r.async.trim().length, `${r.id} async`).toBeGreaterThan(0)
  }
})

test('the idempotency block annotates its primary key, since that is the line doing the work', () => {
  const pk = PROCESSED_EVENTS_LINES.find((l) => l.id === 'pk')
  expect(pk?.note?.trim().length ?? 0).toBeGreaterThan(0)
})

test('all four resilience patterns are carried, since a reader meeting circuit breaker first in an interview was failed by the stage', () => {
  const ids = RESILIENCE_PATTERNS.map((p) => p.id)
  expect(ids).toEqual([
    'timeout',
    'backoff-jitter',
    'circuit-breaker',
    'graceful-degradation',
  ])
})

test('every pattern names the failure it answers, because the pattern without its failure mode is vocabulary', () => {
  for (const p of RESILIENCE_PATTERNS) {
    expect(
      p.failure.trim().length,
      `${p.id} has no failure mode`,
    ).toBeGreaterThan(0)
    expect(p.what.trim().length, `${p.id} has no description`).toBeGreaterThan(
      0,
    )
  }
})

// Collapsed, the row shows its name and one line. PATTERNS.md is specific that
// the summary is what the reader scans, and here it has a second job: the list
// is four patterns a reader is likely to have heard named and not defined, so
// the line they scan has to be the failure, not the mechanism.
test('every pattern has a scannable one-line summary, since the reader decides what to open from the collapsed list alone', () => {
  for (const p of RESILIENCE_PATTERNS) {
    expect(p.summary.trim().length, `${p.id} has no summary`).toBeGreaterThan(0)
    expect(
      p.summary.length,
      `${p.id} summary is a paragraph, not a line`,
    ).toBeLessThan(120)
  }
})

// The doc does not stop at naming the four. It says building all four around
// three third-party calls on day one is the same instinct as reaching for
// microservices, wearing different clothes — and then says, per pattern, what
// earns it its place. Carrying the names without that turns a section about
// restraint into a shopping list.
test('every pattern says what earns it its place, since the doc’s answer for most calls is a timeout and nothing else', () => {
  for (const p of RESILIENCE_PATTERNS) {
    expect(
      p.earnsItsPlace.trim().length,
      `${p.id} has no earns-its-place`,
    ).toBeGreaterThan(0)
  }
  const timeout = RESILIENCE_PATTERNS.find((p) => p.id === 'timeout')
  expect(timeout?.earnsItsPlace).toMatch(/every|most|always/i)
})

test('backoff carries jitter and says why, since retrying in lockstep is the failure that makes retries worse than none', () => {
  const backoff = RESILIENCE_PATTERNS.find((p) => p.id === 'backoff-jitter')
  expect(backoff?.what).toMatch(/jitter/i)
  expect(backoff?.failure).toMatch(/same moment|lockstep|thunder|synchron/i)
})

// The container view exists in two places — the doc's ASCII diagram and this
// app's node list — and they drifted for a whole round before anyone noticed
// the app was a dependency short. Counting the doc's own down-case list is the
// cheapest guard that survives an edit to either side, and it is the shape
// ddl-sync.test.ts and ai-plays.test.ts already use for hand-ported content.
//
// Both directions on purpose: a guard that only catches drift one way is half
// a guard.
test('every box the doc answers a down-case for is a node here, and every node that is not yours is one the doc answers for', () => {
  const md = readFileSync(
    fileURLToPath(
      new URL('../../../../docs/03-architecture.md', import.meta.url),
    ),
    'utf8',
  )
  const section = md.slice(
    md.indexOf('### Sketch the system'),
    md.indexOf('### Design the database'),
  )
  // "For each box that is not yours, what happens when it is down?" — so the
  // set is every node except the application and the user, not just the
  // third-party ones. The scheduled job and the database are the two that get
  // skipped precisely because they are yours, which is what cold-reader run 4
  // found.
  const docNames = [
    ...section.matchAll(/^- \*\*(.+?) (?:down|not running)\*\*/gm),
  ]
    .map((m) => m[1].trim().toLowerCase())
    .sort()
  const appNames = SKETCH_NODES.filter(
    (n) => n.kind !== 'yours' && n.kind !== 'actor',
  )
    .map((n) => n.name.trim().toLowerCase())
    .sort()
  expect(
    docNames.length,
    'the doc answers no down-cases at all',
  ).toBeGreaterThan(0)
  expect(appNames).toEqual(docNames)
})

// The bullet list is prose; the ASCII container diagram above it is the drawing
// the section is actually about, and nothing checked it. A box deleted from the
// diagram and left in the list stayed green — which is how the app came to draw
// an auth provider the diagram had, and the sentence beneath it did not.
test('every node is drawn in the doc’s container diagram too, not only answered for in the list beneath it', () => {
  const md = readFileSync(
    fileURLToPath(
      new URL('../../../../docs/03-architecture.md', import.meta.url),
    ),
    'utf8',
  )
  const start = md.indexOf('The container view of the invoicing app')
  const open = md.indexOf('```', start)
  const diagram = md.slice(open, md.indexOf('```', open + 3))
  expect(diagram.length, 'no fenced diagram found').toBeGreaterThan(100)
  for (const n of SKETCH_NODES) {
    // The boxes are hand-aligned, so a name too wide for its box is drawn
    // shorter: "Email provider" is the box labelled "Email". Match the part
    // that identifies it and let the qualifier be optional.
    const key = n.name.replace(/ (provider|storage|app|job)$/i, '')
    expect(diagram, `${n.id} is a node but not a box`).toContain(key)
  }
})
