'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import { useLocalStorage } from '@/lib/useLocalStorage'

type Theme = 'light' | 'dark' | 'system'

const ORDER: Theme[] = ['system', 'light', 'dark']
const ICONS = { system: Monitor, light: Sun, dark: Moon } as const
const LABELS = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
} as const

export function ThemeToggle() {
  const { value: theme, setValue: setTheme } = useLocalStorage<Theme>(
    'playbook:theme',
    'system',
  )

  // Writing to <html> is a genuine external-system sync, which is what effects
  // are for. The inline script in the layout handles the pre-paint case.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
  }, [theme])

  const Icon = ICONS[theme] ?? Monitor

  return (
    <button
      type="button"
      onClick={() => setTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length])}
      aria-label={`${LABELS[theme] ?? LABELS.system}. Click to change.`}
      // 44px touch target on phones/tablets; tightens to 36px on the desktop
      // rail where the pointer is a mouse.
      className="grid size-11 shrink-0 place-items-center text-subtle transition-colors duration-150 hover:bg-sunken hover:text-fg lg:size-9"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}
