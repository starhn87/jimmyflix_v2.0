'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { HeaderSearch, HeaderSearchControl } from '@/components/header-search'
import { ThemeToggle } from '@/components/theme-toggle'

const navigation = [
  { href: '/', label: 'Movies', match: (path: string) => path === '/' || path.startsWith('/movies') },
  { href: '/tvs', label: 'TV', match: (path: string) => path.startsWith('/tvs') },
  { href: '/trend', label: 'Trend', match: (path: string) => path.startsWith('/trend') },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-tone/8 bg-canvas/90 shadow-header backdrop-blur-xl">
      <div className="mx-auto grid min-h-16 max-w-[1600px] grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-1 px-2 sm:gap-x-3 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_minmax(260px,320px)_auto] lg:px-10">
        <Link
          href="/"
          prefetch={false}
          aria-label="Jimmyflix home"
          className="group order-1 my-3 flex shrink-0 items-center gap-2 rounded-lg text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="grid size-10 place-items-center transition-transform group-hover:scale-105">
            <Image src="/icon.svg" alt="" width={40} height={40} unoptimized />
          </span>
          <span className="hidden font-mono text-lg font-semibold tracking-tight sm:inline">
            Jimmyflix
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="order-2 min-w-0">
          <ul className="flex items-center justify-center gap-0.5 sm:gap-2">
            {navigation.map((item) => {
              const current = item.match(pathname)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    aria-current={current ? 'page' : undefined}
                    className={`relative flex min-h-11 items-center rounded-lg px-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent sm:px-4 ${
                      current
                        ? 'text-ink'
                        : 'text-subtle hover:bg-tone/5 hover:text-ink'
                    }`}
                  >
                    {item.label}
                    {current ? (
                      <span className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-action shadow-[0_0_12px_rgba(103,232,249,0.75)]" />
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <Suspense fallback={<HeaderSearchControl expanded={pathname === '/search'} />}>
          <HeaderSearch pathname={pathname} />
        </Suspense>
        <div className="order-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
