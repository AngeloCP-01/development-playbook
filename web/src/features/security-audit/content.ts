export const STEP_IDS = [
  'scope',
  'boundaries',
  'policy',
  'two-users',
  'query',
  'controls',
  'finding',
  'ai',
  'done',
  'traps',
] as const

export type Operation = 'read' | 'update' | 'delete' | 'export'

export const POLICY: { operation: Operation; probe: string }[] = [
  { operation: 'read', probe: "Open User A's invoice URL" },
  { operation: 'update', probe: "Submit User A's ID with a changed amount" },
  { operation: 'delete', probe: "Delete User A's invoice by ID" },
  { operation: 'export', probe: "Request User A's PDF by ID" },
]

export const FINDING = [
  ['Finding', 'SEC-01: User B can export User A’s invoice PDF'],
  ['Scope', 'GET /api/invoices/:id/pdf'],
  [
    'Evidence',
    'User B’s session and User A’s ID returned PDF bytes; retain only a redacted response',
  ],
  ['Impact', 'Another customer can read invoice and billing details'],
  ['Fix', 'Scope the export lookup to invoices this caller may read'],
  [
    'Retest',
    'User B receives no PDF; User A succeeds; the invoice remains unchanged',
  ],
  ['Risk owner', 'Product owner: no open risk accepted; fix before launch'],
] as const

export const CONTROLS = [
  {
    id: 'sql',
    title: 'SQL insertion',
    detail:
      'Drizzle sql`... ${value}` binds a parameter. sql.raw() inserts unescaped text. Trace any caller value before deciding whether a site is unsafe.',
  },
  {
    id: 'html',
    title: 'Rendered HTML',
    detail:
      'Trace dangerouslySetInnerHTML inputs. Prefer React nodes; sanitize untrusted HTML with a maintained HTML sanitizer.',
  },
  {
    id: 'secrets',
    title: 'Secrets and dependencies',
    detail:
      'Review history secret-scanning findings and high-risk dependency advisories. Revoke or rotate a live exposed secret before planning history cleanup.',
  },
  {
    id: 'rate',
    title: 'Abusable endpoints',
    detail:
      'Limit login and password reset using trusted request identity. An IP-only key can punish shared networks and miss distributed attempts.',
  },
  {
    id: 'sessions',
    title: 'Sessions and reset',
    detail:
      'Use secure cookie attributes, renew IDs on privilege change, and revoke sessions and recovery links after password recovery.',
  },
  {
    id: 'uploads',
    title: 'Uploads, when present',
    detail:
      'Validate allowed types and size, generate storage names, and keep files outside the serving path. Mark this not applicable if there is no upload path.',
  },
  {
    id: 'headers',
    title: 'Response headers',
    detail:
      'Check headers on deployed responses. Roll out HSTS with a short max-age; add includeSubDomains only after every subdomain serves HTTPS.',
  },
] as const
