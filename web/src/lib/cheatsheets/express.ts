import type { Cheatsheet } from './types'
import { runtime } from './express/runtime'
import { async } from './express/async'
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
  async,
  modules,
  io,
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
