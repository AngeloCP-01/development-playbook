/**
 * vitest.config.ts runs the suite under the `node` environment, so there is no
 * `window`, `localStorage`, or `Storage` global. discovery-sheet.test.ts needs all
 * three, including a real `Storage` constructor, since it spies on
 * `Storage.prototype`.
 *
 * Pulling in jsdom or happy-dom for one test file would add a dependency this
 * project deliberately doesn't carry. This is the minimal Web Storage polyfill the
 * suite actually exercises: an in-memory, per-process store with the five methods
 * `Storage` defines.
 *
 * Imported for its side effects only by discovery-sheet.test.ts — deliberately not
 * wired into setupFiles, so no other suite inherits a global `window`.
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
