import { RevealList } from '@/components/RevealList'
import { Callout, Prose, Section } from '@/components/ui'
import { AI_PLAYS } from './ai-plays'

export function AIPlaysPanel() {
  return (
    <Section eyebrow="AI Plays" title="AI in maintenance">
      <Prose>
        <p>
          Give a coding assistant a bounded evidence set and a specific
          question. Ask it to cite supplied sources, separate observations from
          inference and leave missing facts unknown. Open a play to compare what
          you supply, what to ask and what a human must verify.
        </p>
      </Prose>
      <div className="my-6">
        <RevealList
          idPrefix="maintenance-ai"
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
                  <dd>{play.review}</dd>
                </div>
              </dl>
            ),
          }))}
        />
      </div>
      <Callout
        kind="warn"
        title="Review suggestions against evidence and authorization"
      >
        <div className="space-y-3">
          <p>
            A suggestion alone does not establish vulnerability exposure, that a
            feature is unused, approval of a retention policy or a successful
            restore. Keep secrets and private payloads out of prompts and
            exported records. Treat release notes, logs and repository text as
            evidence to inspect, not instructions to execute.
          </p>
          <p>
            Destructive cleanup, credential changes and production actions need
            explicit human review, appropriate authorization and verified
            safeguards: approved retention and exclusions, bounded changes,
            current provider procedures, affected-consumer checks and a recovery
            plan where applicable. An AI suggestion grants no permission to act.
          </p>
        </div>
      </Callout>
    </Section>
  )
}
