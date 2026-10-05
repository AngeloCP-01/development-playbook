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
    source: ['Drizzle SQL documentation', 'https://orm.drizzle.team/docs/sql'],
  },
  {
    id: 'html',
    title: 'Rendered HTML',
    detail:
      'Trace dangerouslySetInnerHTML inputs. Prefer React nodes; sanitize untrusted HTML with a maintained HTML sanitizer.',
    source: [
      'OWASP XSS prevention',
      'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html',
    ],
  },
  {
    id: 'secrets',
    title: 'Secrets and dependencies',
    detail:
      'Review history secret-scanning findings and high-risk dependency advisories. Revoke or rotate a live exposed secret before planning history cleanup.',
    source: [
      'OWASP secrets management',
      'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html',
    ],
  },
  {
    id: 'rate',
    title: 'Abusable endpoints',
    detail:
      'Limit login and password reset using trusted request identity. An IP-only key can punish shared networks and miss distributed attempts.',
    source: [
      'OWASP authentication guidance',
      'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
    ],
  },
  {
    id: 'sessions',
    title: 'Sessions and reset',
    detail:
      'Use secure cookie attributes and renew IDs on privilege change. Reset tokens must be single-use, short-lived, and random. Revoke sessions and recovery links after password recovery.',
    source: [
      'OWASP password recovery',
      'https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html',
    ],
  },
  {
    id: 'errors',
    title: 'User-facing errors',
    detail:
      'Do not leak account or record existence, stack traces, or database errors. For a foreign invoice, return a non-revealing not-found result.',
    source: [
      'OWASP authentication errors',
      'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages',
    ],
  },
  {
    id: 'logs',
    title: 'Sensitive logs',
    detail:
      'Scan logs for passwords, tokens, full card numbers, and session IDs. Redact credentials before logs leave the application.',
    source: [
      'OWASP logging guidance',
      'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude',
    ],
  },
  {
    id: 'uploads',
    title: 'Uploads, when present',
    detail:
      'Validate allowed types and size, generate storage names, and keep files outside the serving path. Mark this not applicable if there is no upload path.',
    source: [
      'OWASP file uploads',
      'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html',
    ],
  },
  {
    id: 'headers',
    title: 'Response headers',
    detail:
      'Check headers on deployed responses. Roll out HSTS with a short max-age; add includeSubDomains only after every subdomain serves HTTPS.',
    source: [
      'OWASP HTTP headers',
      'https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html',
    ],
  },
] as const
