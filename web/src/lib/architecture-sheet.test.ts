import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import '@/test/localstorage-polyfill'
import {
  ARCHITECTURE_KEY,
  EMPTY_DOMAIN,
  readDomainSheet,
  type DomainSheet,
} from './architecture-sheet'

const FILLED: DomainSheet = {
  entities: 'A User has many Clients. A Client has many Invoices.',
  derived: 'overdue — computed from due_date, never stored',
  deletion: 'Invoice: soft delete. Client: restrict while invoices exist.',
  uniqueness: 'invoice number unique per owner, not globally',
  decisions: 'auth strategy — needs an ADR',
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('the key is namespaced and distinct from the other two stages, so the sheets never collide', () => {
  expect(ARCHITECTURE_KEY).toBe('playbook:architecture-worksheet')
})

test('the empty sheet has every field, since the worksheet renders one input per key', () => {
  expect(Object.keys(EMPTY_DOMAIN).sort()).toEqual([
    'decisions',
    'deletion',
    'derived',
    'entities',
    'uniqueness',
  ])
})

test('reads a sheet the worksheet wrote', () => {
  window.localStorage.setItem(ARCHITECTURE_KEY, JSON.stringify(FILLED))
  expect(readDomainSheet()).toEqual(FILLED)
})

test('an absent key reads as empty rather than throwing, because this runs during render', () => {
  expect(readDomainSheet()).toEqual(EMPTY_DOMAIN)
})

test('malformed JSON reads as empty rather than throwing', () => {
  window.localStorage.setItem(ARCHITECTURE_KEY, '{not json')
  expect(readDomainSheet()).toEqual(EMPTY_DOMAIN)
})

test('a JSON primitive reads as empty, since a stored string is not a sheet', () => {
  window.localStorage.setItem(ARCHITECTURE_KEY, '"just a string"')
  expect(readDomainSheet()).toEqual(EMPTY_DOMAIN)
})

test('null reads as empty, because typeof null is object and would pass a naive guard', () => {
  window.localStorage.setItem(ARCHITECTURE_KEY, 'null')
  expect(readDomainSheet()).toEqual(EMPTY_DOMAIN)
})

test('a partial sheet keeps the fields it has and empties the rest, so an older shape still loads', () => {
  window.localStorage.setItem(
    ARCHITECTURE_KEY,
    JSON.stringify({ entities: 'A User has many Clients.' }),
  )
  expect(readDomainSheet()).toEqual({
    ...EMPTY_DOMAIN,
    entities: 'A User has many Clients.',
  })
})

test('non-string values are dropped rather than rendered, since every field feeds a textarea', () => {
  window.localStorage.setItem(
    ARCHITECTURE_KEY,
    JSON.stringify({ entities: 42, derived: 'computed' }),
  )
  expect(readDomainSheet()).toEqual({ ...EMPTY_DOMAIN, derived: 'computed' })
})

test('a throwing localStorage reads as empty, because private-mode browsers throw on access', () => {
  vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
    throw new Error('SecurityError')
  })
  expect(readDomainSheet()).toEqual(EMPTY_DOMAIN)
})
