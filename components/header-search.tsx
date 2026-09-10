'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SearchForm } from '@/components/search-form'
import { SearchIcon } from '@/components/icons'

export function HeaderSearchControl({ initialQuery = '', expanded = false }: {
  initialQuery?: string
  expanded?: boolean
}) {
  const [open, setOpen] = useState(expanded)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const focusOnOpen = useRef(false)

  useEffect(() => {
    if (open && focusOnOpen.current) {
      inputRef.current?.focus()
      focusOnOpen.current = false
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? 'Close search' : 'Open search'}
        aria-expanded={open}
        aria-controls="header-search-panel"
        onClick={() => {
          focusOnOpen.current = !open
          setOpen(!open)
        }}
        className="order-3 grid size-11 shrink-0 place-items-center rounded-full text-ink outline-none hover:bg-tone/8 focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
      >
        <SearchIcon className="size-5" />
      </button>
      <div
        id="header-search-panel"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && buttonRef.current?.getClientRects().length) {
            setOpen(false)
            buttonRef.current.focus()
          }
        }}
        className={`relative order-5 col-span-full pb-3 lg:order-3 lg:col-span-1 lg:block lg:pb-0 ${open ? 'block' : 'hidden'}`}
      >
        <SearchForm initialQuery={initialQuery} inputRef={inputRef} />
      </div>
    </>
  )
}

export function HeaderSearch({ pathname }: { pathname: string }) {
  const params = useSearchParams()
  const query = pathname === '/search' ? params.get('q')?.trim() || '' : ''

  return (
    <HeaderSearchControl
      key={`${pathname}:${query}`}
      initialQuery={query}
      expanded={pathname === '/search'}
    />
  )
}
