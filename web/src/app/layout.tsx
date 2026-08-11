import type { Metadata } from 'next'
import { Archivo, Newsreader, JetBrains_Mono } from 'next/font/google'
import { Sidebar } from '@/components/Sidebar'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  axes: ['wdth'],
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  // Without this, Next cannot resolve absolute URLs for canonical links or
  // social cards, and says so at build time. It is the one metadata field a
  // deploy actually requires.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Development Playbook',
    template: '%s · Development Playbook',
  },
  description:
    'A field manual for building software, from first idea to long-term operation.',
}

const THEME_SCRIPT =
  `(function(){try{` +
  // Stored via useLocalStorage, so the value is JSON — '"dark"', not 'dark'.
  // A legacy or corrupt entry throws here and falls through to the system theme.
  `var t=JSON.parse(localStorage.getItem("playbook:theme"));` +
  `if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)` +
  `}catch(e){}})()`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${newsreader.variable} ${jetbrains.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <a
          href="#main"
          className="t-label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-brand focus:px-4 focus:py-2.5 focus:text-brand-fg"
        >
          Skip to content
        </a>
        <div className="flex min-h-dvh flex-col lg:flex-row">
          <Sidebar />
          <main id="main" className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
