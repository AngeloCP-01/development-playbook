/**
 * The shape `AnnotatedArtifact` renders, extracted from
 * `features/setup/artifacts.ts` when stage 05 became the second caller.
 *
 * `language` is carried and displayed as a label; nothing highlights on it yet.
 * `'tsx'` was added for stage 05, whose blocks are application code rather than
 * configuration.
 */
export type ArtifactLine = {
  text: string
  /** Present only on lines that are a decision. Boilerplate carries no note. */
  note?: string
  /** The line the step's judgment turns on. At most one per artifact. */
  pivot?: boolean
}

export type Artifact = {
  id: string
  filename: string
  language: 'json' | 'jsonc' | 'yaml' | 'ts' | 'tsx' | 'bash'
  lines: ArtifactLine[]
}
