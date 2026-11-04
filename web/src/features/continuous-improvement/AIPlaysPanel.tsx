import { RevealList } from '@/components/RevealList'
import { Callout, Prose, Section } from '@/components/ui'
import { AI_PLAYS } from './content'

export function AIPlaysPanel() {
  return (
    <Section eyebrow="AI Plays" title="AI in continuous improvement">
      <Prose>
        <p>
          These are proposed assistance workflows. Review generated output
          against the supplied evidence; it cannot establish demand, causality
          or product success. Use only material permitted for the selected tool
          and remove unnecessary personal or confidential details.
        </p>
      </Prose>
      <div className="my-6">
        <RevealList
          idPrefix="improvement-ai"
          rows={AI_PLAYS.map((play) => ({
            id: play.id,
            title: play.title,
            summary: play.summary,
            body: (
              <dl className="max-w-[68ch] space-y-3 text-sm leading-6 text-muted">
                <div>
                  <dt className="t-label mb-1 text-blueprint">Supply</dt>
                  <dd>{play.input}</dd>
                </div>
                <div>
                  <dt className="t-label mb-1 text-blueprint">Ask</dt>
                  <dd>{play.request}</dd>
                </div>
                <div>
                  <dt className="t-label mb-1 text-blueprint">Verify</dt>
                  <dd>{play.verify}</dd>
                </div>
              </dl>
            ),
          }))}
        />
      </div>
      <Callout title="A prompt constraint to check against the output">
        <p>
          “Separate observation, interpretation and proposal. Cite the supplied
          IDs. List missing evidence and contradictory cases. Do not invent
          users, quotes, counts or results.” Check that the model followed those
          instructions.
        </p>
      </Callout>
      <div className="mt-6">
        <Callout kind="warn" title="Synthetic feedback stays synthetic">
          <p>
            Synthetic feedback can help rehearse analysis, but cannot replace
            observations from intended users. A generated theme is a proposal to
            inspect, not measured prevalence.
          </p>
        </Callout>
      </div>
    </Section>
  )
}
