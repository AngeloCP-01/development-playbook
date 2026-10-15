export type Outcome = {
  id: string
  label: string
  observer: string
  start: string
  stop: string
  evidence: string
  diagnostic: string
  limits: string
}

export const ORDER_REQUEST = [
  'Validate',
  'Authenticate',
  'Check inventory',
  'Create order',
  'Initiate payment',
  'Response',
] as const

export const OUTCOMES: readonly Outcome[] = [
  {
    id: 'checkout',
    label: 'Browser checkout',
    observer: 'Browser',
    start: 'Place order click',
    stop: 'Response receipt in the browser',
    evidence:
      'Browser-observed click-to-response durations for the selected segment.',
    diagnostic:
      'Server route duration and instrumented database or external-call spans explain part of this clock.',
    limits:
      'A faster route does not prove the entire browser outcome improved. Provider waiting and the later payment webhook are outside the checkout request.',
  },
  {
    id: 'payment',
    label: 'Visible payment status',
    observer: 'User-visible payment display',
    start: 'Payment submitted',
    stop: 'Paid visible to the user',
    evidence:
      'Payment submission and visible Paid timestamps for the same order.',
    diagnostic:
      'Separate payment initiation to webhook receipt, webhook receipt to persisted Paid, and persisted Paid to visible status.',
    limits:
      'A fast webhook handler does not establish how long the provider waited or the user waited for the status display.',
  },
  {
    id: 'inventory',
    label: 'Inventory consumer',
    observer: 'Inventory consumer completion record',
    start: 'OrderPaid published',
    stop: 'Inventory consumer completed',
    evidence:
      'Publish and completion timestamps joined by an opaque event or order ID.',
    diagnostic: 'Queue waiting and instrumented consumer processing intervals.',
    limits:
      'This processing lag does not prove logistics or notification completed. Dependencies require a product rule.',
  },
  {
    id: 'logistics',
    label: 'Logistics consumer',
    observer: 'Logistics consumer completion record',
    start: 'OrderPaid published',
    stop: 'Logistics consumer completed',
    evidence:
      'Publish and completion timestamps joined by an opaque event or order ID.',
    diagnostic: 'Queue waiting and instrumented consumer processing intervals.',
    limits:
      'This processing lag does not prove inventory or notification completed. Consumers are branches, not a serial chain.',
  },
  {
    id: 'notification',
    label: 'Notification consumer',
    observer: 'Notification consumer completion record',
    start: 'OrderPaid published',
    stop: 'Notification consumer completed',
    evidence:
      'Publish and completion timestamps joined by an opaque event or order ID.',
    diagnostic: 'Queue waiting and instrumented consumer processing intervals.',
    limits:
      'Completion does not prove the customer received or saw a message. A delivery promise needs its own observer and stop event.',
  },
]
