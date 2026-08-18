import { TriangleAlert } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AI_LIMIT, PLAYS, type Play } from './ai-plays'

/**
 * Source: `docs/04-project-setup.md`, "### AI in project setup".
 *
 * One `RevealList` over `PLAYS`, not a twelfth hand-rolled accordion — eleven
 * components were migrated onto the shared component on the previous branch so
 * that this stage would not start a new copy.
 *
 * `kind` rides as the row badge rather than splitting the list into four
 * groups. The doc names the mechanism in parentheses after each title — a
 * skill, a saved command, memory, an MCP — and it is the *mechanism* a reader
 * needs beside the play, not a taxonomy: two of the five are saved commands and
 * three are one apiece, so grouping would produce three lists of one.
 *
 * `AI_LIMIT` is outside the list on purpose. It is the section's closing point
 * and the reason this panel is not a list of wins, and behind a disclosure it is
 * the paragraph a skimming reader never opens. Shape follows stage 03's
 * "What none of this replaces" box.
 *
 * **TD-34.** `RevealList` hardcodes `<h3>` for each row heading. This component
 * therefore contributes nothing at heading level itself — the lead line above
 * the rows is a `<p>`, not the `<h3>` `AIArchitecturePlays` puts in the same
 * slot — so the rows nest under `Section`'s `<h2>` and the outline stays h2 → h3.
 * An `<h3>` in the header slot would flatten it, which is TD-34 exactly.
 * `AIPlays.test.tsx` pins that.
 *
 * Titles and bodies go through `InlineCode`. `ai-plays.ts` keeps the doc's
 * bullet leads verbatim — `ai-plays.test.ts` compares them to
 * `docs/04-project-setup.md` character for character — so the backticks cannot
 * come out of the data, and without this the panel prints them. That makes the
 * title a `ReactNode`, which `RevealList` renders unwrapped, so the
 * `font-medium` span its string branch would have supplied is written here
 * instead. The titles keep ambient body size: unlike `AIArchitecturePlays`'
 * 14px claims, these five phrases have no reason to opt out of the house style.
 */

const KIND_LABEL: Record<Play['kind'], string> = {
  skill: 'Skill',
  command: 'Saved command',
  memory: 'Memory',
  mcp: 'MCP',
}

export function AIPlays() {
  return (
    <div className="space-y-4">
      <RevealList
        idPrefix="setup-ai"
        header={
          <p className="border-b border-line px-5 py-3.5 text-sm leading-6 text-muted">
            Setup is where an agent is most useful and most confidently wrong,
            and the split is clean: it is good at files you commit, blind to
            everything else.
          </p>
        }
        rows={PLAYS.map((play) => ({
          id: play.id,
          // `RevealList` wraps a *string* title in its own `font-medium` span
          // and renders a `ReactNode` unwrapped. Passing `InlineCode` therefore
          // means owning that span here, or two of the five titles would lose
          // their weight in exchange for their code spans.
          title: (
            <span className="font-medium">
              <InlineCode text={play.title} />
            </span>
          ),
          badge: (
            <span className="t-label shrink-0 border border-line px-1.5 py-0.5 text-subtle">
              {KIND_LABEL[play.kind]}
            </span>
          ),
          body: (
            <p className="measure text-sm leading-6 text-muted">
              <InlineCode text={play.body} />
            </p>
          ),
        }))}
      />

      <div className="border border-line bg-raised p-4 sm:p-5">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
          <TriangleAlert className="size-4 shrink-0 text-warn" aria-hidden />
          The half that is not in your repository
        </p>
        <p className="measure text-sm leading-6 text-muted">{AI_LIMIT}</p>
      </div>
    </div>
  )
}
