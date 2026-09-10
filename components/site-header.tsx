'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { type FormEvent, useRef, useState } from 'react'
import { SearchIcon } from '@/components/icons'
import { ThemeToggle } from '@/components/theme-toggle'

const navigation = [
  { href: '/', label: 'Movies', match: (path: string) => path === '/' || path.startsWith('/movies') },
  { href: '/tvs', label: 'TV', match: (path: string) => path.startsWith('/tvs') },
  { href: '/trend', label: 'Trend', match: (path: string) => path.startsWith('/trend') },
  { href: '/search', label: 'Search', match: (path: string) => path.startsWith('/search') },
]

export function SiteHeader() {
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    const input = inputRef.current
    const query = input?.value.trim() || ''

    if (!query) {
      event.preventDefault()
      setError('Enter a title to search.')
      input?.focus()
      return
    }

    if (input) input.value = query
    setError('')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-tone/8 bg-canvas/90 shadow-header backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-1 px-2 sm:gap-3 sm:px-6 lg:px-10">
        <Link
          href="/"
          prefetch={false}
          aria-label="Jimmyflix home"
          className="group flex shrink-0 items-center gap-2 rounded-lg text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="grid size-10 place-items-center transition-transform group-hover:scale-105">
            <Image src="/icon.svg" alt="" width={40} height={40} unoptimized />
          </span>
          <span className="hidden font-mono text-lg font-semibold tracking-tight sm:inline">
            Jimmyflix
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="min-w-0 flex-1">
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

        <div className="relative hidden w-56 shrink-0 lg:block">
          <form action="/search" method="get" onSubmit={handleSearch}>
            <label htmlFor="header-search" className="sr-only">
              Search movies and TV shows
            </label>
            <input
              ref={inputRef}
              id="header-search"
              name="q"
              type="search"
              placeholder="Search titles"
              onChange={() => setError('')}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'header-search-error' : undefined}
              className="h-10 w-full rounded-full border border-tone/12 bg-tone/6 py-2 pr-10 pl-4 text-sm text-ink outline-none transition placeholder:text-faint hover:border-tone/25 focus:border-accent/70 focus:bg-tone/9 focus:ring-3 focus:ring-accent/10"
            />
            <button
              type="submit"
              aria-label="Search movies and TV shows"
              className="absolute top-0 right-0 grid size-10 place-items-center rounded-full text-subtle outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
            >
              <SearchIcon className="size-4.5" />
            </button>
          </form>
          {error ? (
            <p
              id="header-search-error"
              role="alert"
              className="absolute top-12 right-0 w-max rounded-lg border border-rose-400/30 bg-rose-950 px-3 py-2 text-xs text-rose-100 shadow-xl"
            >
              {error}
            </p>
          ) : null}
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
