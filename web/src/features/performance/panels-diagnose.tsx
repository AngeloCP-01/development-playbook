import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { InlineCode } from '@/components/InlineCode'
import { RevealFacet } from '@/components/RevealFacet'
import { RevealList } from '@/components/RevealList'
import { Term } from '@/components/Term'
import { Card, Prose, Section } from '@/components/ui'
import { INVENTORY_PLAN } from './artifacts'
import { FIXES, type FixRow } from './content'
import { BOTTLENECK_CASES, COMPARISON_CASES, QUERY_CASES } from './decisions'
import { DecisionDrill } from './DecisionDrill'

export function BottleneckPanel() {
  return (
    <Section title="Move inward from the slow outcome">
      <Prose>
        <p>
          For checkout, begin with browser latency, route duration and
          representative slow traces. A Paid-status problem needs provider,
          webhook and display timestamps. A late downstream action needs publish
          and completion timestamps. The worked cart shows{' '}
          <Term id="n-plus-one">N+1 queries</Term> in a controlled reproduction,
          not a measured production win.
        </p>
      </Prose>
      <div className="mt-6">
        <Figure
          n={2}
          caption="The hypothetical 20-item cart exposes repeated inventory calls; batching remains an experiment until stock correctness and the same user outcome are retested."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <p className="t-label mb-2 text-brand">Hypothetical before</p>
              <p className="text-sm">
                21 inventory queries: one list lookup and one availability query
                per item.
              </p>
            </Card>
            <Card>
              <p className="t-label mb-2 text-brand">
                Hypothetical after candidate
              </p>
              <p className="text-sm">
                One batched availability lookup for the cart&apos;s SKUs.
                Preserve the same stock decision and order result.
              </p>
            </Card>
          </div>
        </Figure>
      </div>
      <div className="mt-6">
        <DecisionDrill
          title="What does the evidence support?"
          cases={BOTTLENECK_CASES}
        />
      </div>
    </Section>
  )
}

export function QueryPanel() {
  return (
    <Section title="Read the plan before adding an index">
      <Prose>
        <p>
          If a query remains slow, inspect its actual{' '}
          <Term id="query-plan">query plan</Term> on representative data. This
          SQL executes a single SELECT when you run it in your database. The
          playbook does not execute it or treat it as a production p95. Inspect
          actual and estimated rows, filtered rows, buffers and time; planner
          costs are not milliseconds.
        </p>
      </Prose>
      <div className="mt-6">
        <Figure
          n={3}
          caption="The chapter's EXPLAIN statement diagnoses one inventory query; it does not measure browser checkout or a field percentile."
        >
          <AnnotatedArtifact artifact={INVENTORY_PLAN} />
        </Figure>
      </div>
      <div className="mt-6">
        <DecisionDrill
          title="What does this plan establish?"
          cases={QUERY_CASES}
        />
      </div>
    </Section>
  )
}

export function FixesPanel({ fixes = FIXES }: { fixes?: readonly FixRow[] }) {
  return (
    <Section title="Choose a fix only when evidence supports it">
      <Prose>
        <p>
          These candidates are not a ranking. Cache work also needs a{' '}
          <Term id="cache-invalidation">cache invalidation</Term> rule and
          correctness checks.
        </p>
      </Prose>
      <div className="mt-6">
        <RevealList
          idPrefix="performance-fixes"
          rows={fixes.map((row) => ({
            id: row.id,
            title: row.title,
            body: (
              <div className="space-y-3">
                <RevealFacet label="Evidence">
                  <InlineCode text={row.evidence} />
                </RevealFacet>
                <RevealFacet label="Correctness and cost" tone="warn">
                  <InlineCode text={row.risk} />
                </RevealFacet>
                <RevealFacet label="Comparable retest">
                  <InlineCode text={row.retest} />
                </RevealFacet>
              </div>
            ),
          }))}
        />
      </div>
    </Section>
  )
}

export function ComparePanel() {
  return (
    <Section title="Did the user's outcome improve?">
      <Prose>
        <p>
          The cases below describe hypothetical evidence; they supply no
          measured production p95s. Compare the same observer, outcome,
          population, segment, data and cache state. Versions and collection
          dates deliberately differ; window lengths and conditions stay
          comparable. Record new sample counts rather than assuming they match.
        </p>
      </Prose>
      <div className="mt-6">
        <DecisionDrill title="Compare outcomes" cases={COMPARISON_CASES} />
      </div>
    </Section>
  )
}
