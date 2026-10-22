import Link from 'next/link'
import { RevealList } from '@/components/RevealList'
import { Prose, Section } from '@/components/ui'
import { DecisionDrill } from './DecisionDrill'
import { COMMENT_CASES, EVIDENCE_CASES } from './practice'
export function CommentsPanel() {
  return (
    <Section title="Explain the exception in a comment">
      <Prose>
        <p>
          Implementation comments explain intent or constraints a reader cannot
          recover from code. Module documentation may describe purpose, use and
          behavior too. Rename unclear code when a good name carries the
          meaning.
        </p>
        <p>
          The four comment specimens are illustrative patterns, not runnable
          implementations.{' '}
          <a href="https://google.github.io/eng-practices/review/reviewer/looking-for.html#comments">
            Google&apos;s review guidance
          </a>{' '}
          makes the distinction.{' '}
          <a href="https://docs.stripe.com/metadata#data">
            Stripe&apos;s metadata source
          </a>{' '}
          supports its value limit; an attempt count alone cannot diagnose a
          delivery failure.
        </p>
      </Prose>
      <div className="mt-5">
        <DecisionDrill
          setId="comments"
          title="What does the comment explain?"
          cases={COMMENT_CASES}
        />
      </div>
    </Section>
  )
}
export function AIPanel() {
  return (
    <Section title="AI in documentation">
      <Prose>
        <p>
          Give an assistant the source and version in scope. It can map affected
          documents, draft structure, compare an example with a schema and
          suggest lookup headings. Ask it to label missing facts rather than
          complete a plausible guess.
        </p>
      </Prose>
      <div className="mt-5">
        <DecisionDrill
          setId="evidence"
          title="Which evidence do you actually have?"
          cases={EVIDENCE_CASES}
        />
      </div>
      <div className="mt-5">
        <RevealList
          idPrefix="documentation-ai"
          rows={[
            {
              id: 'review',
              title: 'Ground and review the draft',
              body: (
                <div>
                  <p>
                    A named reviewer compares the draft with the relevant diff,
                    contract, code, verified procedure or approved notes. Use
                    synthetic identifiers; remove real credentials, contact
                    details and private payloads.
                  </p>
                  <p className="mt-3">
                    Permissions, limits, defaults, provider behavior, incident
                    outcomes and release promises need a traceable source.
                    Template infrastructure and test claims must be replaced
                    with project facts.
                  </p>
                </div>
              ),
            },
            {
              id: 'limits',
              title: 'Record the limits of validation',
              body: (
                <p>
                  Read, Compile and Execute establish different things. For
                  execution, record the command, revision, environment and
                  observed result. An assistant needs the same evidence as
                  anyone else. A successful isolated example does not establish
                  production recovery;{' '}
                  <Link href="/stages/14-post-deployment-verification">
                    Stage 14 owns production verification
                  </Link>
                  .
                </p>
              ),
            },
          ]}
        />
      </div>
    </Section>
  )
}
