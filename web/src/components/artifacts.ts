/**
 * Bridge for `AnnotatedArtifact.test.tsx`, which moved here with its
 * `import { ARTIFACTS } from './artifacts'` unedited (the move's hard exit
 * condition — see the task-1 report). The nineteen config blocks stay
 * stage-04-local data in `features/setup/artifacts.ts`; only the *types*
 * extracted to `./artifact.ts` on the move. This file re-exports the values
 * so the relative import the test already had keeps resolving to the same
 * data, without editing the test.
 */
export { ARTIFACTS } from '@/features/setup/artifacts'
