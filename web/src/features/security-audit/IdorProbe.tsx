'use client'

import { useState } from 'react'
import { Callout } from '@/components/ui'

export function IdorProbe() {
  const [choice, setChoice] = useState<'allow' | 'deny' | null>(null)

  return (
    <div className="space-y-5">
      <div className="border border-line bg-raised p-5">
        <p className="t-label mb-3 text-brand">Request under test</p>
        <p className="text-sm leading-relaxed">
          User B is signed in. They know User A&apos;s invoice UUID and request
          its PDF through <code>GET /api/invoices/:id/pdf</code>. The UI never
          offered this link to B. What should the handler do?
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={choice !== null}
          onClick={() => setChoice('allow')}
          className="t-ui min-h-11 border border-line bg-raised px-4 py-3 text-left text-sm hover:border-brand disabled:cursor-default disabled:opacity-70"
        >
          Allow the export: B is authenticated and the UUID is hard to guess
        </button>
        <button
          type="button"
          disabled={choice !== null}
          onClick={() => setChoice('deny')}
          className="t-ui min-h-11 border border-line bg-raised px-4 py-3 text-left text-sm hover:border-brand disabled:cursor-default disabled:opacity-70"
        >
          Deny the export: B has no permission for A&apos;s invoice
        </button>
      </div>
      {choice && (
        <Callout
          kind={choice === 'allow' ? 'trap' : 'info'}
          title="Policy result"
        >
          <p>
            No PDF bytes returned. Authentication and an unguessable ID do not
            grant access. The invoice remains unchanged. Retest as User A to
            confirm the owner can still export it.
          </p>
        </Callout>
      )}
    </div>
  )
}
