import { expect, test } from 'vitest'
import { togglePick } from './characteristics-store'

test('picking adds the id, which is the ordinary case', () => {
  expect(togglePick([], 'correctness', 4)).toEqual(['correctness'])
})

test('picking again removes it, so a misclick is not permanent', () => {
  expect(togglePick(['correctness'], 'correctness', 4)).toEqual([])
})

test('the cap blocks a fifth pick rather than silently dropping the first, because a silent swap would hide the trade', () => {
  const four = ['a', 'b', 'c', 'd']
  expect(togglePick(four, 'e', 4)).toEqual(four)
})

test('at the cap you can still deselect, or the reader is stuck with their first four', () => {
  expect(togglePick(['a', 'b', 'c', 'd'], 'b', 4)).toEqual(['a', 'c', 'd'])
})

test('order is preserved, so the list does not reshuffle under the reader as they pick', () => {
  expect(togglePick(['a', 'b'], 'c', 4)).toEqual(['a', 'b', 'c'])
})
