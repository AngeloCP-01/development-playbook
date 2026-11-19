'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { useLocalStorage } from '@/lib/useLocalStorage'

type Theme = 'light' | 'dark' | 'system'

const ORDER: Theme[] = ['system', 'light', 'dark']
const ICONS = { system: Monitor, light: Sun, dark: Moon } as const
const LABELS = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
} as const

let transitioning = false

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

  function changeTheme(event: MouseEvent<HTMLButtonElement>) {
    if (transitioning) return
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]
    const apply = () => {
      flushSync(() => setTheme(next))
      // Apply inside the snapshot callback, before the browser captures the new view.
      if (next === 'system')
        document.documentElement.removeAttribute('data-theme')
      else document.documentElement.setAttribute('data-theme', next)
    }
    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      apply()
      return
    }

    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )
    transitioning = true
    const root = document.documentElement
    root.classList.add('theme-reveal')
    const transition = document.startViewTransition(apply)
    void transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 560,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
      .catch(() => {
        /* A skipped transition still applies the theme. */
      })
    void transition.finished
      .catch(() => {})
      .finally(() => {
        root.classList.remove('theme-reveal')
        transitioning = false
      })
  }

  const Icon = ICONS[theme] ?? Monitor

  return (
    <button
      type="button"
      onClick={changeTheme}
      aria-label={`${LABELS[theme] ?? LABELS.system}. Click to change.`}
      // 44px touch target on phones/tablets; tightens to 36px on the desktop
      // rail where the pointer is a mouse.
      className="grid size-11 shrink-0 place-items-center text-subtle transition-colors duration-150 hover:bg-sunken hover:text-fg lg:size-9"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}
