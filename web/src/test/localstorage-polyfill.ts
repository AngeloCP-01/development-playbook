/**
 * The `unit` vitest project runs under the `node` environment, so there is no
 * `window`, `localStorage`, or `Storage` global. `discovery-sheet.test.ts` and
 * `architecture-sheet.test.ts` need all three, including a real `Storage`
 * constructor, since they spy on `Storage.prototype`.
 *
 * jsdom IS available in this repository — the `dom` project uses it for
 * `*.test.tsx` render tests. This polyfill survives that change because both
 * importers test `lib/` modules rather than components, so moving them into the
 * `dom` project would mean renaming a module test to `.test.tsx` to buy a DOM it
 * does not otherwise need. This is the minimal Web Storage polyfill the suite
 * actually exercises: an in-memory, per-process store with the five methods
 * `Storage` defines.
 *
 * Imported for its side effects only, and deliberately not wired into
 * `setupFiles`, so no other suite in the `unit` project inherits a global
 * `window`.
 */

class MemoryStorage {
  private store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }
}

globalThis.Storage = MemoryStorage as unknown as typeof Storage
globalThis.localStorage = new MemoryStorage() as unknown as Storage
globalThis.window = globalThis as unknown as Window & typeof globalThis
