import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CHEATSHEETS } from '@/lib/cheatsheets'
import ReferencePage from './page'

test('offers the glossary and stack alongside the existing drawn and undrawn sheets', () => {
  render(<ReferencePage />)
  expect(
    screen.getByRole('link', { name: /Glossary/ }).getAttribute('href'),
  ).toBe('/reference/glossary')
  expect(
    screen.getByRole('link', { name: /Default Stack/ }).getAttribute('href'),
  ).toBe('/reference/stack')
  for (const sheet of CHEATSHEETS) {
    const link = screen.getByText(sheet.title, { exact: true }).closest('a')!
    expect(link.getAttribute('href')).toBe(`/reference/${sheet.slug}`)
  }
  expect(screen.getByRole('link', { name: /Python/ }).textContent).toContain(
    'Not drawn',
  )
  expect(screen.getByText('28 of 31')).toBeTruthy()
})

test('discovers Algorithms and the DSA reference', () => {
  render(<ReferencePage />)
  expect(screen.getByText('Algorithms', { exact: true })).toBeTruthy()
  expect(
    screen
      .getByText('DSA Patterns', { exact: true })
      .closest('a')
      ?.getAttribute('href'),
  ).toBe('/reference/dsa-patterns')
})
