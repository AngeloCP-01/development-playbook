import type { Cheatsheet } from './types'
import { runtime } from './express/runtime'
import { eventLoop } from './express/event-loop'
import { async } from './express/async'
import { workers } from './express/workers'
import { processLifetime } from './express/process'
import { modules } from './express/modules'
import { io } from './express/io'
import { http } from './express/http'
import { flow } from './express/flow'
import { input } from './express/input'
import { errors } from './express/errors'
import { state } from './express/state'
import { security } from './express/security'
import { testing } from './express/testing'
import { operations } from './express/operations'
const families = [
  runtime,
  eventLoop,
  async,
  workers,
  modules,
  io,
  processLifetime,
  http,
  flow,
  input,
  errors,
  state,
  security,
  testing,
  operations,
]
export const nodeExpress: Cheatsheet = {
  slug: 'express',
  title: 'Node.js & Express',
  group: 'Languages',
  blurb:
    'Trace Node execution, repair an Express API and defend its input, identity and lifecycle boundaries.',
  source: {
    title: 'Node 22 documentation',
    author: 'Node.js contributors / OpenJS',
    url: 'https://nodejs.org/docs/latest-v22.x/api/',
  },
  additionalSources: [
    {
      title: 'Event-loop phases and nextTick',
      author: 'Node.js contributors / OpenJS',
      url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
    },
    {
      title: 'Blocking and native work allocation',
      author: 'Node.js contributors / OpenJS',
      url: 'https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop',
    },
    {
      title: 'Worker threads (Node 22)',
      author: 'Node.js contributors / OpenJS',
      url: 'https://nodejs.org/docs/latest-v22.x/api/worker_threads.html',
    },
    {
      title: 'StringDecoder (Node 22)',
      author: 'Node.js contributors / OpenJS',
      url: 'https://github.com/nodejs/node/blob/v22.23.4/doc/api/string_decoder.md',
    },
    {
      title: 'Streams and backpressure (Node 22)',
      author: 'Node.js contributors / OpenJS',
      url: 'https://nodejs.org/docs/latest-v22.x/api/stream.html',
    },
    {
      title: 'Process and task queues (Node 22)',
      author: 'Node.js contributors / OpenJS',
      url: 'https://github.com/nodejs/node/blob/v22.23.4/doc/api/process.md',
    },
    {
      title: 'CommonJS caching and cycles (Node 22)',
      author: 'Node.js contributors / OpenJS',
      url: 'https://nodejs.org/docs/latest-v22.x/api/modules.html',
    },
    {
      title: 'CSRF prevention: synchronizer tokens and SameSite',
      author: 'OWASP',
      url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html',
    },
    {
      title: 'Express 5 error handling',
      author: 'Express contributors / OpenJS',
      url: 'https://expressjs.com/en/guide/error-handling/',
    },
    {
      title: 'Authorization',
      author: 'OWASP',
      url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',
    },
  ],
  sections: families.flatMap((f) => f.sections),
  activities: families.flatMap((f) => f.activities),
}
