import { GlossaryReference } from '@/features/reference/GlossaryReference'

export const metadata = {
  title: 'Glossary',
  description:
    'Full definitions of playbook terms, in alphabetical order, with links to the stages that use them.',
}

export default function GlossaryPage() {
  return <GlossaryReference />
}
