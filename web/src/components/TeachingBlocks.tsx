import type { TeachingBlock } from '@/lib/cheatsheets/types'

/** Server output only: authored order, literal code, semantic comparison tables. */
export function TeachingBlocks({
  blocks,
  headingLevel = 4,
}: {
  blocks: TeachingBlock[]
  headingLevel?: 3 | 4
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h4'
  return (
    <div className="mt-4 min-w-0 space-y-4 text-[0.9375rem] leading-relaxed">
      {blocks.map((block) => {
        switch (block.kind) {
          case 'paragraph':
            return (
              <p key={block.id} className="whitespace-pre-line">
                {block.text}
              </p>
            )
          case 'code':
            return (
              <div key={block.id} className="min-w-0">
                <p className="t-label mb-1.5 text-subtle">{block.label}</p>
                <pre
                  tabIndex={0}
                  aria-label={block.label}
                  className="scroll-mt-36 scroll-mb-4 overflow-x-auto border border-line bg-sunken p-3 text-[0.8125rem]"
                >
                  <code className="t-data whitespace-pre text-fg">
                    {block.code}
                  </code>
                </pre>
              </div>
            )
          case 'table':
            return (
              <div
                key={block.id}
                role="region"
                aria-label={block.label}
                tabIndex={0}
                className="scroll-mt-36 scroll-mb-4 overflow-x-auto border border-line"
              >
                <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                  <caption className="t-label bg-sunken px-3 py-2 text-left text-subtle">
                    {block.label}
                  </caption>
                  <thead>
                    <tr>
                      {block.columns.map((column, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="t-ui border-t border-line p-3 align-top font-semibold"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="whitespace-pre-line border-t border-line p-3 align-top"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'interview':
            return (
              <section key={block.id} className="border-l-2 border-line pl-4">
                <Heading className="t-head text-base">{block.question}</Heading>
                <p className="mt-2">{block.answer}</p>
                {block.weakAnswer && (
                  <p className="mt-2 text-muted">
                    Weak answer: {block.weakAnswer}
                  </p>
                )}
                {block.followUp && (
                  <p className="mt-2 text-muted">Follow-up: {block.followUp}</p>
                )}
              </section>
            )
        }
      })}
    </div>
  )
}
