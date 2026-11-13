import type { Cheatsheet } from './types'
import { runtime } from './python/runtime'
import { objects } from './python/objects'
import { collections } from './python/collections'
import { text } from './python/text'
import { functions } from './python/functions'
import { iteration } from './python/iteration'
import { classes } from './python/classes'
import { errors } from './python/errors'
import { files } from './python/files'
import { modules } from './python/modules'
import { stdlib } from './python/stdlib'
const families = [
  runtime,
  objects,
  collections,
  text,
  functions,
  iteration,
  classes,
  errors,
  files,
  modules,
  stdlib,
]
export const python: Cheatsheet = {
  slug: 'python',
  title: 'Python',
  group: 'Languages',
  blurb:
    'Trace Python objects, repair small programs and defend their validation, resource and concurrency boundaries.',
  source: {
    title: 'Python 3.12 tutorial',
    author: 'Python contributors / PSF',
    url: 'https://docs.python.org/3.12/tutorial/',
  },
  additionalSources: [
    {
      title: 'Data model and object protocols',
      author: 'Python contributors / PSF',
      url: 'https://docs.python.org/3.12/reference/datamodel.html',
    },
    {
      title: 'Copying and nested ownership',
      author: 'Python contributors / PSF',
      url: 'https://docs.python.org/3.12/library/copy.html',
    },
    {
      title: 'Coroutines, TaskGroup and cancellation (3.12 baseline)',
      author: 'Python contributors / PSF',
      url: 'https://docs.python.org/3.12/library/asyncio-task.html',
    },
    {
      title: 'Collections and queue operations',
      author: 'Python contributors / PSF',
      url: 'https://docs.python.org/3.12/library/collections.html',
    },
    {
      title: 'Process startup and isolation',
      author: 'Python contributors / PSF',
      url: 'https://docs.python.org/3.12/library/multiprocessing.html',
    },
    {
      title: 'Free-threaded build boundaries',
      author: 'Python contributors / PSF',
      url: 'https://docs.python.org/3.14/howto/free-threading-python.html',
    },
    {
      title: 'Installing packages into a selected interpreter',
      author: 'PyPA',
      url: 'https://packaging.python.org/en/latest/tutorials/installing-packages/',
    },
  ],
  sections: families.flatMap((f) => f.sections),
  activities: families.flatMap((f) => f.activities),
}
