import { StackReference } from '@/features/reference/StackReference'
import { STACK } from '@/lib/stack'

export const metadata = {
  title: STACK.title,
  description:
    'The playbook’s default tools, rationale, support caveats and reasons to choose another stack.',
}

export default function StackPage() {
  return <StackReference />
}
