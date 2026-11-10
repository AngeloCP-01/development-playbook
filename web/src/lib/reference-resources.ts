/** Native reference resources are separate from the cheatsheet registry/count. */
export const REFERENCE_RESOURCES = [
  {
    slug: 'glossary',
    href: '/reference/glossary',
    title: 'Glossary',
    description:
      'Full definitions, stable term links and the stages that put them to work.',
  },
  {
    slug: 'stack',
    href: '/reference/stack',
    title: 'Default Stack',
    description:
      'Default tools, reasons to choose them, support caveats and when to deviate.',
  },
] as const
