import { afterEach, expect, test, vi } from 'vitest'
import {
  DISCOVERY_KEY,
  EMPTY_SHEET,
  readDiscoverySheet,
} from './discovery-sheet'

afterEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

test('reads a sheet stage 01 saved, which is the whole point of the carry-forward', () => {
  window.localStorage.setItem(
    DISCOVERY_KEY,
    JSON.stringify({
      ...EMPTY_SHEET,
      success: 'They know who owes them money.',
    }),
  )
  expect(readDiscoverySheet().success).toBe('They know who owes them money.')
})

test('returns the empty sheet when nothing is stored, since most readers arrive at 02 cold', () => {
  expect(readDiscoverySheet()).toEqual(EMPTY_SHEET)
})

test('returns the empty sheet on malformed JSON rather than throwing into the render', () => {
  window.localStorage.setItem(DISCOVERY_KEY, '{not json')
  expect(readDiscoverySheet()).toEqual(EMPTY_SHEET)
})

test('fills missing fields from a partial sheet, so an older saved shape cannot crash a field read', () => {
  window.localStorage.setItem(
    DISCOVERY_KEY,
    JSON.stringify({ success: 'only this' }),
  )
  const sheet = readDiscoverySheet()
  expect(sheet.success).toBe('only this')
  expect(sheet.notThis).toBe('')
})

test('coerces non-string field values to empty, because JSON.parse will hand back anything', () => {
  window.localStorage.setItem(
    DISCOVERY_KEY,
    JSON.stringify({ success: 42, notThis: null }),
  )
  const sheet = readDiscoverySheet()
  expect(sheet.success).toBe('')
  expect(sheet.notThis).toBe('')
})

test('never writes to stage 01’s key, because stage 02 is a reader and must not corrupt it', () => {
  const setItem = vi.spyOn(Storage.prototype, 'setItem')
  const removeItem = vi.spyOn(Storage.prototype, 'removeItem')
  readDiscoverySheet()
  window.localStorage.setItem(DISCOVERY_KEY, '{bad')
  setItem.mockClear()
  readDiscoverySheet()
  expect(setItem).not.toHaveBeenCalled()
  expect(removeItem).not.toHaveBeenCalled()
})

test('survives localStorage throwing, as it does in some privacy modes', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('denied')
  })
  expect(readDiscoverySheet()).toEqual(EMPTY_SHEET)
})
