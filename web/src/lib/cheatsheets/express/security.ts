import type { Section, SheetActivity } from '../types'
export const security: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Security',
      study: {
        id: 'security',
        label: 'Security',
        hint: 'Trace the example, then defend the boundary',
      },
      introduction: [
        {
          id: 'security-intro',
          kind: 'paragraph',
          text: 'Choose a topic to inspect its worked example and interview answer. Try the local exercise before revealing its reasoning. Examples use Node 22 JavaScript (.mjs unless explicitly stated) and Express 5.3.0. HTTP factories do not listen until the test or startup owner calls listen.',
        },
      ],
      rows: [
        {
          term: 'Check ownership after trusted identity',
          what: 'Authentication establishes identity; authorization decides whether that identity may access this book. The principal below is injected by the test fixture, never read from an arbitrary caller header. The fixture models a Bearer-verifier boundary: production middleware must verify the credential before injecting its principal.',
          study: {
            id: 'identity-and-access',
            summary:
              'Authentication establishes identity; authorization decides whether that identity may access this book. The principal below is injected by the test fixture, never read from an arbitrary caller header. The fixture models a Bearer-verifier boundary: production middleware must verify the credential before injecting its principal.',
            activityIds: ['identity-and-access-practice'],
          },
          teaching: [
            {
              id: 'identity-and-access-model',
              kind: 'paragraph',
              text: 'Authentication establishes identity; authorization decides whether that identity may access this book. The principal below is injected by the test fixture, never read from an arbitrary caller header. The fixture models a Bearer-verifier boundary: production middleware must verify the credential before injecting its principal.',
            },
            {
              id: 'identity-and-access-example',
              kind: 'code',
              label:
                'Check ownership after trusted identity — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp(principal = null) { const app = express();\n const books = new Map([['b1', { id: 'b1', ownerId: 'u1' }]]);\n app.get('/books/:id', (req, res) => {\n if (!principal) return res.set('WWW-Authenticate', 'Bearer').status(401).end();\n const book = books.get(req.params.id);\n if (!book) return res.status(404).end();\n if (book.ownerId !== principal.id) return res.status(403).end();\n return res.json(book);\n }); return app;\n}",
            },
            {
              id: 'identity-and-access-trace',
              kind: 'table',
              label: 'Check ownership after trusted identity result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'No principal gives 401; u2 requesting b1 gives 403; u1 gets b1; an authenticated lookup of an absent ID gives 404.',
                  'Authentication establishes identity; authorization decides whether that identity may access this book. The principal below is injected by the test fixture, never read from an arbitrary caller header. The fixture models a Bearer-verifier boundary: production middleware must verify the credential before injecting its principal.',
                ],
              ],
            },
            {
              id: 'identity-and-access-mistake',
              kind: 'paragraph',
              text: 'Common mistake: An X-User-ID header is caller input, not proof of identity. Production needs a shown trusted verifier/session boundary. Consider a consistent 404 policy if hiding existence is required.',
            },
            {
              id: 'identity-and-access-interview',
              kind: 'interview',
              question: 'Is knowing an object ID sufficient permission?',
              answer:
                'No. Check the authenticated principal against the object policy on every request. Unpredictable IDs do not replace authorization.',
              followUp:
                'Add a list route. Can you filter only after returning data?',
            },
          ],
        },
        {
          term: 'Describe credentials without inventing authentication',
          what: 'A session cookie typically carries an opaque session ID; server storage holds session state. Signed tokens carry claims but signatures do not hide them. Decoding a JWT does not verify it.',
          study: {
            id: 'cookies-and-tokens',
            summary:
              'A session cookie typically carries an opaque session ID; server storage holds session state. Signed tokens carry claims but signatures do not hide them. Decoding a JWT does not verify it.',
            activityIds: ['cookies-and-tokens-practice'],
          },
          teaching: [
            {
              id: 'cookies-and-tokens-model',
              kind: 'paragraph',
              text: 'A session cookie typically carries an opaque session ID; server storage holds session state. Signed tokens carry claims but signatures do not hide them. Decoding a JWT does not verify it.',
            },
            {
              id: 'cookies-and-tokens-example',
              kind: 'code',
              label:
                'Describe credentials without inventing authentication — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express();\n app.get('/cookie-demo', (req, res) => { res.cookie('demo', 'fixture-only', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60000 }); res.status(204).end(); });\n return app;\n}",
            },
            {
              id: 'cookies-and-tokens-trace',
              kind: 'table',
              label:
                'Describe credentials without inventing authentication result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'The Set-Cookie header includes HttpOnly, Secure, SameSite=Lax and an expiry. This is a header demonstration, not a working login or browser acceptance test.',
                  'A session cookie typically carries an opaque session ID; server storage holds session state. Signed tokens carry claims but signatures do not hide them. Decoding a JWT does not verify it.',
                ],
              ],
            },
            {
              id: 'cookies-and-tokens-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Do not put secrets in signed-but-readable claims. Passwords need purpose-built password hashing. Session revocation, token expiry, key rotation and TLS are separate responsibilities.',
            },
            {
              id: 'cookies-and-tokens-interview',
              kind: 'interview',
              question: 'What is the token revocation tradeoff?',
              answer:
                'Stateless verification is convenient, but short lifetimes bound exposure; immediate revocation needs coordinated state such as a denylist/session version. Sessions also need a durable shared store when scaled.',
              followUp: 'Does HttpOnly prevent all CSRF?',
            },
          ],
        },
        {
          term: 'Separate browser sharing from permission',
          what: 'CORS tells browsers which origins may read responses. It is not API authentication. Cookie-authenticated mutations also need CSRF defenses because a request may be sent even when response reading is blocked.',
          study: {
            id: 'cors-and-csrf',
            summary:
              'CORS tells browsers which origins may read responses. It is not API authentication. Cookie-authenticated mutations also need CSRF defenses because a request may be sent even when response reading is blocked.',
            activityIds: ['cors-and-csrf-practice'],
          },
          teaching: [
            {
              id: 'cors-and-csrf-model',
              kind: 'paragraph',
              text: 'CORS tells browsers which origins may read responses. It is not API authentication. Cookie-authenticated mutations also need CSRF defenses because a request may be sent even when response reading is blocked.',
            },
            {
              id: 'cors-and-csrf-example',
              kind: 'code',
              label:
                'Separate browser sharing from permission — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express();\n app.get('/books', (req, res) => { res.vary('Origin');\n if (req.get('Origin') === 'https://reader.example') res.set('Access-Control-Allow-Origin', 'https://reader.example');\n res.json([]); }); return app;\n}",
            },
            {
              id: 'cors-and-csrf-trace',
              kind: 'table',
              label: 'Separate browser sharing from permission result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'Only the allowlisted origin receives the sharing header. Node fetch still reads the response for a denied origin: it does not enforce browser CORS.',
                  'CORS tells browsers which origins may read responses. It is not API authentication. Cookie-authenticated mutations also need CSRF defenses because a request may be sent even when response reading is blocked.',
                ],
              ],
            },
            {
              id: 'cors-and-csrf-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Reflecting every Origin with credentials grants untrusted sites access. This GET-only header demo does not implement preflight, credential policy or CSRF validation.',
            },
            {
              id: 'cors-and-csrf-interview',
              kind: 'interview',
              question: 'Can curl bypass CORS?',
              answer:
                'CORS constrains browser script response access, not all HTTP clients. The server must authenticate and authorize requests independently.',
              followUp:
                'What would you add for a cookie-authenticated mutation?',
            },
          ],
        },
        {
          term: 'Trust only the deployment boundary',
          what: 'Forwarded headers are untrusted unless a known proxy rewrites them. Configure trust for the actual topology; avoid blanket trust. Parameterized queries separate values from SQL structure; dynamic identifiers need allowlists.',
          study: {
            id: 'proxy-and-input-defense',
            summary:
              'Forwarded headers are untrusted unless a known proxy rewrites them. Configure trust for the actual topology; avoid blanket trust. Parameterized queries separate values from SQL structure; dynamic identifiers need allowlists.',
            activityIds: ['proxy-and-input-defense-practice'],
          },
          teaching: [
            {
              id: 'proxy-and-input-defense-model',
              kind: 'paragraph',
              text: 'Forwarded headers are untrusted unless a known proxy rewrites them. Configure trust for the actual topology; avoid blanket trust. Parameterized queries separate values from SQL structure; dynamic identifiers need allowlists.',
            },
            {
              id: 'proxy-and-input-defense-example',
              kind: 'code',
              label:
                'Trust only the deployment boundary — standalone .mjs / exported factory',
              code: "import express from 'express';\nexport function makeApp() { const app = express(); app.set('trust proxy', false);\n app.get('/ip', (req, res) => res.json({ ip: req.ip })); return app;\n}",
            },
            {
              id: 'proxy-and-input-defense-trace',
              kind: 'table',
              label: 'Trust only the deployment boundary result',
              columns: ['Observation', 'Reasoning'],
              rows: [
                [
                  'A forged X-Forwarded-For does not replace the socket peer IP with trust proxy false. Production behind a proxy needs an explicit, topology-specific trust policy.',
                  'Forwarded headers are untrusted unless a known proxy rewrites them. Configure trust for the actual topology; avoid blanket trust. Parameterized queries separate values from SQL structure; dynamic identifiers need allowlists.',
                ],
              ],
            },
            {
              id: 'proxy-and-input-defense-mistake',
              kind: 'paragraph',
              text: 'Common mistake: Trusting any forwarded header lets callers forge rate-limit identity or scheme. Path normalization and SQL string escaping are not general authorization boundaries.',
            },
            {
              id: 'proxy-and-input-defense-interview',
              kind: 'interview',
              question: 'Can you parameterize a table name like a value?',
              answer:
                'Usually not. Use an explicit server-side allowlist for identifiers and the chosen driver parameter API for values; do not build SQL by concatenating user text.',
              followUp:
                'Your service has both direct and proxied paths. Is trust one hop always safe?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'identity-and-access-practice',
      title: 'Check ownership after trusted identity practice',
      prompt: 'Add a list route. Can you filter only after returning data?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. Scope the query to authorized objects on the server before returning any data; test both permitted and denied principals.',
      explanation:
        'No. Scope the query to authorized objects on the server before returning any data; test both permitted and denied principals. An X-User-ID header is caller input, not proof of identity. Production needs a shown trusted verifier/session boundary. Consider a consistent 404 policy if hiding existence is required.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'cookies-and-tokens-practice',
      title: 'Describe credentials without inventing authentication practice',
      prompt: 'Does HttpOnly prevent all CSRF?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. It prevents script access to the cookie, while browsers may still attach it to requests. CSRF defenses address that separate boundary.',
      explanation:
        'No. It prevents script access to the cookie, while browsers may still attach it to requests. CSRF defenses address that separate boundary. Do not put secrets in signed-but-readable claims. Passwords need purpose-built password hashing. Session revocation, token expiry, key rotation and TLS are separate responsibilities.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'cors-and-csrf-practice',
      title: 'Separate browser sharing from permission practice',
      prompt: 'What would you add for a cookie-authenticated mutation?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'A defined CSRF token/origin-check policy, appropriate SameSite cookies and authorization. Test actual browser cross-origin behavior before claiming browser enforcement.',
      explanation:
        'A defined CSRF token/origin-check policy, appropriate SameSite cookies and authorization. Test actual browser cross-origin behavior before claiming browser enforcement. Reflecting every Origin with credentials grants untrusted sites access. This GET-only header demo does not implement preflight, credential policy or CSRF validation.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
    {
      id: 'proxy-and-input-defense-practice',
      title: 'Trust only the deployment boundary practice',
      prompt:
        'Your service has both direct and proxied paths. Is trust one hop always safe?',
      context:
        'Original reading-list API exercise. State the assumption and explain the failure boundary before revealing the answer.',
      answer:
        'No. Unequal path lengths may let clients control a trusted position. Restrict network paths and configure trusted proxy addresses/topology.',
      explanation:
        'No. Unequal path lengths may let clients control a trusted position. Restrict network paths and configure trusted proxy addresses/topology. Trusting any forwarded header lets callers forge rate-limit identity or scheme. Path normalization and SQL string escaping are not general authorization boundaries.',
      followUp: 'Which test would fail if this boundary were removed?',
    },
  ],
}
