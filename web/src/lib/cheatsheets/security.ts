import type { Cheatsheet } from './types'

/** A quick audit card for the two-user invoice case taught in stage 08. */
export const security: Cheatsheet = {
  slug: 'security',
  title: 'Security Audit',
  group: 'Standards',
  stage: '08-security-audit',
  blurb:
    'Map the boundary, run the same invoice ID as two users, and leave a finding someone else can retest.',
  source: {
    title: 'Insecure Direct Object References testing',
    author: 'OWASP Web Security Testing Guide',
    url: 'https://wstg.owasp.org/latest/4-Web_Application_Security_Testing/05-Authorization/04-Insecure_Direct_Object_References/',
    image: {
      src: '/reference/security-invoice-audit.svg',
      width: 640,
      height: 780,
      alt: 'User B is denied access to User A’s invoice after the server checks ownership.',
      origin: 'original',
    },
  },
  sections: [
    {
      title: 'Name the boundary and policy',
      note: 'The invoice ID is untrusted even after sign-in. The browser crosses a trust boundary at every Server Action and route handler.',
      rows: [
        {
          term: 'Protected asset',
          what: 'Invoice body, billing address, PDF bytes, and the ability to change or delete the record.',
          when: 'Inventory what disclosure or modification would harm the customer.',
        },
        {
          term: 'Entry points',
          what: 'List the read page, update and delete actions, and PDF export handler. Test the endpoint directly even if its button is hidden.',
          when: 'Before checking code or running a scanner.',
        },
        {
          term: 'Policy',
          what: 'Only the invoice owner may read, update, delete, or export. A support admin needs an explicit grant; a known UUID is not permission.',
          when: 'Write the expected result before sending test requests.',
        },
      ],
    },
    {
      title: 'Probe with two users',
      note: 'Create User A and User B with separate invoices. Use B’s trusted session with A’s known invoice ID. A should still succeed on A’s own record.',
      rows: [
        {
          term: 'Read',
          what: 'As User B, open User A’s invoice URL. Deny the body and any useful existence detail.',
          when: 'Check page reads and direct data endpoints.',
        },
        {
          term: 'Update',
          what: 'As User B, submit User A’s ID and a changed amount. Deny the action; confirm A’s amount is unchanged.',
          when: 'Check every mutation path, including direct action calls.',
        },
        {
          term: 'Delete',
          what: 'As User B, submit User A’s ID to delete. Deny the action; confirm A’s invoice still exists unchanged.',
          when: 'Check destructive operations separately from reads.',
        },
        {
          term: 'Export',
          what: 'As User B, request User A’s PDF by ID. Deny the request and return no PDF bytes.',
          when: 'A protected page does not protect a separate export handler.',
        },
        {
          term: 'Anonymous',
          what: 'Repeat with no session. Deny all four operations, even with a valid invoice ID.',
        },
        {
          term: 'Admin without grant',
          what: 'Try the same invoice as a support admin without a recorded grant. Deny access to the invoice body and PDF.',
        },
        {
          term: 'Positive control',
          what: 'As User A, confirm each permitted operation succeeds on A’s own invoice. Denial alone does not prove the policy works.',
        },
      ],
    },
    {
      title: 'Inspect the enforcement path',
      rows: [
        {
          term: 'Session-derived owner',
          what: 'Derive the user on the server and scope the invoice lookup by both ID and owner. Never accept ownerId from the request as authority.',
          when: 'At every data access path, not only the page that links to it.',
        },
        {
          term: 'Direct entry points',
          what: 'Recheck authorization inside each reachable Server Action and route handler. A hidden control or page-level guard is insufficient.',
        },
        {
          term: 'Related controls',
          what: 'Trace raw SQL insertion, untrusted HTML, reset tokens, abusable endpoints, sensitive logs, secrets, dependencies, and deployed headers.',
          when: 'Record the applicable checks; do not mark an absent feature as tested.',
        },
      ],
    },
    {
      title: 'Leave a retestable finding',
      rows: [
        {
          term: 'Evidence and impact',
          what: 'Record the tested endpoint, actor, invoice ID, redacted request and response, date, and customer harm. Keep real invoice bytes out of the report.',
        },
        {
          term: 'Fix',
          what: 'Scope the lookup to the caller’s permitted invoices before returning a body or producing PDF bytes.',
        },
        {
          term: 'Retest',
          what: 'Repeat the same User B request: no PDF or record change. Repeat as User A: the permitted path still works.',
        },
        {
          term: 'Risk owner',
          what: 'If risk remains, name the owner, reason, compensating control, and review date. Do not accept a cross-user leak because the ID is hard to guess.',
        },
      ],
    },
  ],
}
