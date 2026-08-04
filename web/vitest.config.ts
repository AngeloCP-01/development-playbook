import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Mirrors tsconfig's "@/*" so importing STAGE_CONTENT (which pulls
    // component files) resolves. `extends: true` on each project below is what
    // carries this into both of them.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    // Two environments, chosen by file extension rather than by a per-file
    // docblock. A docblock is something every new test file has to remember,
    // and a forgotten one surfaces as `document is not defined` — which reads
    // like a broken component rather than a missing comment. The extension is
    // structural, which is the same argument this stage's own soft-delete
    // section makes about filters.
    //
    // vitest 4 removed `environmentMatchGlobs`; `projects` is the mechanism.
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./src/test/setup.ts'],
        },
      },
    ],
  },
})
