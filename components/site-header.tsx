'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FormEvent, useRef, useState } from 'react'
import { FilmIcon, SearchIcon } from '@/components/icons'

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
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#080b12]/90 shadow-[0_8px_30px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          prefetch={false}
          aria-label="Jimmyflix home"
          className="group flex shrink-0 items-center gap-2 rounded-lg text-white outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-slate-950 shadow-lg shadow-blue-950/40 transition-transform group-hover:scale-105">
            <FilmIcon className="size-6" />
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
                    className={`relative flex min-h-11 items-center rounded-lg px-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:px-4 ${
                      current
                        ? 'text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {current ? (
                      <span className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.75)]" />
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
              className="h-10 w-full rounded-full border border-white/12 bg-white/6 py-2 pr-10 pl-4 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/25 focus:border-cyan-300/70 focus:bg-white/9 focus:ring-3 focus:ring-cyan-300/10"
            />
            <button
              type="submit"
              aria-label="Search movies and TV shows"
              className="absolute top-0 right-0 grid size-10 place-items-center rounded-full text-slate-400 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300"
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
      </div>
    </header>
  )
}
