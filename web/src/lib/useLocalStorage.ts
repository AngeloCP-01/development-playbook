'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * localStorage is an external store, so it is read through useSyncExternalStore
 * rather than an effect. That gives correct hydration for free — React renders
 * the server snapshot first, then swaps to the stored value — and avoids the
 * cascading re-render that setState-in-an-effect causes.
 */

const listeners = new Set<() => void>()

/** getSnapshot must return a stable reference, so parsed values are memoised by raw string. */
const cache = new Map<string, { raw: string | null; parsed: unknown }>()

function emit() {
  for (const l of listeners) l()
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  // 'storage' only fires for *other* tabs; same-tab writes go through emit().
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

function read<T>(key: string, initial: T): T {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(key)
  } catch {
    return initial
  }

  const hit = cache.get(key)
  if (hit && hit.raw === raw) return hit.parsed as T

  let parsed = initial
  if (raw !== null) {
    try {
      parsed = JSON.parse(raw) as T
    } catch {
      parsed = initial // corrupt entry — fall back rather than crash
    }
  }
  cache.set(key, { raw, parsed })
  return parsed
}

/**
 * @param key   storage key
 * @param initial default value. Must be a stable reference (module constant or
 *                primitive) — it is the server snapshot.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key, initial),
    () => initial,
  )

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function'
          ? (next as (prev: T) => T)(read(key, initial))
          : next
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved))
      } catch {
        // Quota exceeded or private mode. Seed the cache anyway so the UI still
        // updates — it just will not survive a reload.
        cache.set(key, { raw: JSON.stringify(resolved), parsed: resolved })
      }
      emit()
    },
    [key, initial],
  )

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* nothing useful to do */
    }
    cache.delete(key)
    emit()
  }, [key])

  return { value, setValue, reset } as const
}
