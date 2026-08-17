import { Fragment } from 'react'

/**
 * Renders a data string's backticked spans as `<code>`.
 *
 * Stage 04 is the first stage whose *data* carries markdown. Stage 03's
 * modules hold concepts, and its code spans live in JSX prose written by hand
 * (`Architecture.tsx` has some thirty `<code className="t-data">` elements).
 * Stage 04 holds filenames, flags and commands, so its seven data modules
 * quote them the way the doc does, and there are around two hundred of them.
 *
 * The backticks cannot simply be stripped from the data. Several of those
 * strings are asserted to appear in `docs/04-project-setup.md`
 * character-for-character — `CLIENT_FAILURE`, `PIN_RULE`, the artifact blocks —
 * and the doc has the backticks. So the data stays faithful and the rendering
 * is what changes. Wave 1 shipped without this and the panels would have shown
 * the backtick characters; a component review caught it across five modules at
 * once, which is what made it worth one shared piece rather than five fixes.
 *
 * Deliberately not a markdown renderer. It knows one construct. Anything else
 * in these strings — asterisks, links, underscores — passes through as written,
 * because a half-markdown renderer invites data that assumes the other half.
 */
export function InlineCode({ text }: { text: string }) {
  const parts = text.split('`')

  // An even number of backticks splits into an odd number of parts, and only
  // then does every second part sit between a matched pair. An odd number means
  // a typo in the data: render it verbatim so the stray tick is visible rather
  // than turning the tail of the sentence into a monospace span.
  if (parts.length % 2 === 0) return <>{text}</>

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="t-data break-words">
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
