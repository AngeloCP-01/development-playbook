import type { Cheatsheet } from './types'

/**
 * Transcribed from the fifteen-step roadmap, condensed to what belongs on a
 * lookup sheet. Steps 14 and 15 (build real projects, interview prep) are
 * exercises rather than reference material and are left out on purpose — a
 * cheatsheet answers "what was that again", not "how do I practice this".
 */
export const apiDesign: Cheatsheet = {
  slug: 'api-design',
  title: 'API Design',
  group: 'Architecture',
  stage: '03-architecture',
  blurb: 'From HTTP fundamentals through versioning, auth and rate limits.',
  source: {
    title: 'Master Plan for API Design',
    author: 'Shalini Goyal',
    image: {
      src: '/reference/masterplan-api-design.webp',
      width: 1080,
      height: 1350,
      alt: 'A fifteen-step API design roadmap, from HTTP fundamentals to production skills, each step listing four topics.',
    },
  },
  sections: [
    {
      title: 'Fundamentals and protocol',
      rows: [
        {
          term: 'API types',
          what: 'REST, GraphQL, gRPC, SOAP — different answers to the same question of how a client asks a server for something.',
        },
        {
          term: 'Request-response lifecycle',
          what: 'Client sends a request, server processes it, server returns a response — the shape every API type still fits inside.',
        },
        {
          term: 'HTTP methods and status codes',
          what: 'GET, POST, PUT, PATCH, DELETE map to intent; status codes and headers carry the outcome.',
        },
        {
          term: 'Payload basics',
          what: 'JSON, XML and form data as wire formats; URLs, HTTPS and TLS as the transport underneath them.',
        },
      ],
    },
    {
      title: 'Designing the resource',
      rows: [
        {
          term: 'REST principles',
          what: 'Resource-based URLs, CRUD operations mapped onto HTTP methods, consistent naming.',
        },
        {
          term: 'Versioning and idempotency',
          what: 'A breaking change ships as a new version rather than breaking every client already live; idempotent methods are safe to retry.',
        },
        {
          term: 'Request and response shape',
          what: 'A consistent JSON structure, pagination for large result sets, filtering and sorting as query parameters.',
        },
        {
          term: 'Error responses',
          what: 'A standardized error shape, so a client can branch on it instead of parsing prose.',
        },
      ],
    },
    {
      title: 'Auth and validation',
      rows: [
        {
          term: 'API keys and JWT',
          what: 'A key identifies the caller; a JWT carries claims about who they are without a database round trip to check.',
        },
        {
          term: 'OAuth 2.0 and OpenID Connect',
          what: 'Delegated authorization and identity on top of it — a client acts on a user’s behalf without holding their password.',
        },
        {
          term: 'RBAC and session vs token',
          what: 'Role-based access control decides what an authenticated caller may do; sessions and tokens are two different ways to carry "who is this" between requests.',
        },
        {
          term: 'Input validation',
          what: 'Validate and sanitize at the boundary, with error codes and exceptions that say what failed rather than that something did.',
        },
      ],
    },
    {
      title: 'Data and performance',
      rows: [
        {
          term: 'SQL vs NoSQL',
          what: 'Relational structure and transactions against flexible schema and horizontal scale — the trade the data model makes.',
        },
        {
          term: 'Caching',
          what: 'Redis or similar in front of a slow read path, with rate limiting and compression protecting what caching does not.',
        },
        {
          term: 'Async processing and load balancing',
          what: 'Work too slow for a request-response cycle moves off it; load balancing spreads traffic once one server is not enough.',
        },
      ],
    },
    {
      title: 'Docs, testing and security',
      rows: [
        {
          term: 'OpenAPI and Swagger',
          what: 'A machine-readable API specification that also generates interactive documentation and client SDKs.',
        },
        {
          term: 'Testing',
          what: 'Unit and integration tests, automated mocks, and manual exploration with a tool like Postman.',
        },
        {
          term: 'Transport and injection defenses',
          what: 'HTTPS and CORS at the edge; defenses against XSS, CSRF and SQL injection in the application.',
        },
        {
          term: 'Secrets',
          what: 'Credentials and keys live outside the codebase, with logging and monitoring watching for misuse.',
        },
      ],
    },
    {
      title: 'Deployment and advanced patterns',
      rows: [
        {
          term: 'Gateways and containers',
          what: 'An API gateway as the single entry point in front of many services; Docker and Kubernetes as how those services run.',
        },
        {
          term: 'CI/CD',
          what: 'Pipelines that build, test and deploy on every change rather than on a manual release day.',
        },
        {
          term: 'Beyond REST',
          what: 'GraphQL and gRPC as alternatives to REST; WebSockets and webhooks for the cases a request-response cycle does not fit.',
        },
        {
          term: 'Microservices communication',
          what: 'Services talk to each other the same way clients talk to the API — the design principles above apply internally too.',
        },
      ],
    },
  ],
}
