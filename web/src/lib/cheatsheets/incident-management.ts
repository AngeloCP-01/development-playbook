import type { Cheatsheet } from './types'

/** Lookup companion to stage 16. The chapter teaches the decisions; this sheet
 * keeps the checks and handoff fields close at hand during an incident. */
export const incidentManagement: Cheatsheet = {
  slug: 'incident-management',
  title: 'Incident Management',
  group: 'Standards',
  stage: '16-incident-management',
  blurb:
    'First response, safe mitigation, updates, recovery proof, and follow-up in one lookup.',
  source: {
    title: 'Incident Response',
    author: 'Google SRE Workbook',
    url: 'https://sre.google/workbook/incident-response/',
  },
  sections: [
    {
      title: 'Declare and coordinate',
      note: 'Use local severity policy. These labels are examples, not universal response deadlines.',
      rows: [
        {
          term: 'Confirm impact',
          what: 'Check the affected customer operation, including background completion and oldest pending work. Record observed impact, start time, unknowns, and responder.',
          when: 'At the first credible signal. A healthy homepage does not clear a stalled worker.',
        },
        {
          term: 'Declare',
          what: 'Open one incident record and timeline when impact or credible risk needs coordinated attention. Name the owner and a provisional severity.',
          when: 'Before the exact cause or user count is known. Reassess severity as evidence changes.',
        },
        {
          term: 'Critical / Major / Minor',
          what: 'Critical: widespread outage, credible compromise, data loss, or blocked payments. Major: important customer work blocked or degraded. Minor: limited impact with a safe workaround.',
          when: 'Apply your service’s agreed policy; a small user count does not make data loss minor.',
        },
        {
          term: 'Own the response',
          what: 'One incident commander owns decisions, timeline, and updates; a solo responder may hold all roles. Set an update reminder.',
          when: 'At declaration and whenever responders change.',
        },
        {
          term: 'Escalate / hand off',
          what: 'Send impact, severity, incident link, actions and results, unknowns, and the help needed. Keep ownership until the receiver explicitly accepts it and the next action.',
          when: 'Use the agreed acknowledgment deadline and fallback; escalate immediately if harm grows.',
        },
      ],
    },
    {
      title: 'Limit harm and keep people informed',
      note: 'Investigate enough to choose a safe action; keep communicating while diagnosis continues.',
      rows: [
        {
          term: 'Choose a mitigation',
          what: 'Check evidence, prerequisites, possible harm, stop condition, and the customer operation that will prove the action helped. Record operator, time, and observed result.',
          when: 'Before rollback, disabling a feature, adding capacity, degrading service, or fixing forward.',
        },
        {
          term: 'Rollback',
          what: 'Confirm a relevant change, a known-good target, and schema compatibility. Application rollback does not undo a database migration.',
          when: 'Only when the change plausibly caused impact and the old version can safely run.',
        },
        {
          term: 'Uncertain outcomes',
          what: 'Hold retries or replay until an authoritative result or reliable record establishes what already happened. Keep unresolved items for reviewed reconciliation.',
          when: 'A timeout may have happened after a send, charge, or write succeeded.',
        },
        {
          term: 'Possible compromise',
          what: 'Use the security response route to contain access and protect evidence. Keep credentials and customer data out of public incident channels.',
          when: 'Availability returning does not establish that access is safe.',
        },
        {
          term: 'Customer update',
          what: 'State observed impact, current action, unknowns, and the next update time through a channel that remains reachable. Update at that time even without a change.',
          when: 'Throughout mitigation and investigation. The next update is not a recovery estimate.',
        },
      ],
    },
    {
      title: 'Prove recovery',
      note: 'Service recovery and follow-up closure are separate states.',
      rows: [
        {
          term: 'Affected operation',
          what: 'Verify that the customer operation meets its agreed criteria. Compare errors, latency, and actual outcomes with the baseline.',
          when: 'Before calling the incident resolved; a green provider status or homepage is insufficient.',
        },
        {
          term: 'Delayed work',
          what: 'Account for the affected set: oldest pending age, completion, failures, confirmed side effects, eligible replay, expired work, and limitations disclosed to customers.',
          when: 'Before resuming uncertain work or announcing full recovery.',
        },
        {
          term: 'Observation window',
          what: 'Observe normal work long enough for this service’s operation to complete; record why the window fits.',
          when: 'After mitigation and reconciliation, before the resolved update.',
        },
        {
          term: 'Recovery update',
          what: 'Report verified customer impact and remaining limitations through the agreed channel. Keep unresolved investigation and prevention work open with owners.',
          when: 'After recovery checks pass, not merely after a mitigation command succeeds.',
        },
      ],
    },
    {
      title: 'Close the learning loop',
      rows: [
        {
          term: 'Postmortem',
          what: 'Record impact, an evidence-backed timeline, contributing conditions, detection and response gaps, and explicit unknowns. Describe system conditions without blaming the responder.',
          when: 'For major or critical incidents, while evidence is fresh.',
        },
        {
          term: 'Actions',
          what: 'Give each corrective action an owner, due date, and completion evidence. Review overdue work; a ticket alone is not risk reduction.',
          when: 'Until the correction is verified or remaining risk has an explicit decision.',
        },
        {
          term: 'Runbook',
          what: 'Update the safe action, stop conditions, escalation route, recovery checks, and rehearsal from what the incident taught.',
          when: 'After follow-up identifies a changed procedure or missing check.',
        },
      ],
    },
  ],
}
