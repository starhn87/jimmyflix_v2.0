'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useRef, useState } from 'react'
import { SearchIcon } from '@/components/icons'

interface SearchFormProps {
  initialQuery?: string
  compact?: boolean
}

export function SearchForm({ initialQuery = '', compact = false }: SearchFormProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState(initialQuery)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = query.trim()

    if (!normalized) {
      setError('Enter a movie or TV show title.')
      inputRef.current?.focus()
      return
    }

    setError('')
    router.push(`/search?q=${encodeURIComponent(normalized)}`)
  }

  return (
    <section
      aria-label="Search movies and TV shows"
      className={`mx-auto w-full max-w-3xl px-4 ${
        compact ? 'pt-10 pb-8 sm:pt-14' : 'grid min-h-[55vh] place-items-center py-16'
      }`}
    >
      <div className="w-full">
        {!compact ? (
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
              Find your next watch
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
              Search every story
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Explore movies and TV shows by title.
            </p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="main-search" className="sr-only">
            Movie or TV show title
          </label>
          <div className="group grid min-h-15 grid-cols-[minmax(0,1fr)_58px] overflow-hidden rounded-2xl border border-white/15 bg-white/7 shadow-2xl shadow-black/25 transition focus-within:border-cyan-300/70 focus-within:ring-4 focus-within:ring-cyan-300/10">
            <input
              ref={inputRef}
              id="main-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                if (error) setError('')
              }}
              type="search"
              placeholder="Search movies and TV shows"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'main-search-error' : undefined}
              spellCheck={false}
              className="min-w-0 bg-transparent px-5 text-base text-white outline-none placeholder:text-slate-500 sm:text-lg"
            />
            <button
              type="submit"
              aria-label="Search movies and TV shows"
              className="grid place-items-center border-l border-white/10 bg-cyan-300 text-slate-950 outline-none transition hover:bg-cyan-200 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-white"
            >
              <SearchIcon className="size-6" />
            </button>
          </div>
        </form>
        {error ? (
          <p id="main-search-error" role="alert" className="mt-3 px-2 text-sm text-rose-300">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  )
}
