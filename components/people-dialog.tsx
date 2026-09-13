'use client'

import { useDeferredValue, useEffect, useId, useRef, useState, type RefObject } from 'react'
import { CloseIcon, SearchIcon } from '@/components/icons'
import { DetailPersonCard } from '@/components/detail-person-card'
import { filterDetailPeople, PEOPLE_PAGE_SIZE, type DetailPerson, type PeopleMessages } from '@/lib/detail-people'
import type { Locale } from '@/lib/i18n'

interface PeopleDialogProps {
  people: DetailPerson[]
  title: string
  kind: 'cast' | 'crew'
  locale: Locale
  messages: PeopleMessages
  returnFocus: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

function PeopleResults({ people, locale, messages, onNavigate }: {
  people: DetailPerson[]; locale: Locale; messages: PeopleMessages; onNavigate: () => void
}) {
  const [limit, setLimit] = useState(PEOPLE_PAGE_SIZE)
  const list = useRef<HTMLUListElement>(null)
  const nextPerson = useRef<number | null>(null)
  useEffect(() => {
    if (nextPerson.current === null) return
    const link = list.current?.children[nextPerson.current]?.querySelector('a')
    nextPerson.current = null
    link?.focus({ preventScroll: true })
    link?.scrollIntoView({ block: 'nearest' })
  }, [limit])
  return (
    <>
      <ul ref={list} className="grid gap-3 sm:grid-cols-2">
        {people.slice(0, limit).map((person) => (
          <li key={person.id} className="min-w-0"><DetailPersonCard person={person} locale={locale} compact onNavigate={onNavigate} /></li>
        ))}
      </ul>
      {people.length > limit ? (
        <button type="button" onClick={() => { nextPerson.current = limit; setLimit((current) => current + PEOPLE_PAGE_SIZE) }} className="mx-auto mt-6 flex min-h-11 cursor-pointer items-center rounded-full border border-tone/15 px-6 text-sm font-semibold text-ink outline-none hover:bg-tone/7 focus-visible:ring-3 focus-visible:ring-accent/50">
          {messages.loadMore} <span className="ml-2 text-faint">{limit} / {people.length}</span>
        </button>
      ) : null}
    </>
  )
}

export function PeopleDialog({ people, title, kind, locale, messages, returnFocus, onClose }: PeopleDialogProps) {
  const id = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const resultsPanel = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const deferredQuery = useDeferredValue(query)
  const results = filterDetailPeople(people, deferredQuery, role)
  const roles = kind === 'crew' ? [...new Map(people.flatMap((person) => person.roles.map((item) => [item.key, item] as const))).values()] : []
  const searchLabel = kind === 'cast' ? messages.searchCast : messages.searchCrew
  const close = () => dialog.current?.close()

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    const trigger = returnFocus.current
    const root = document.documentElement
    const overflow = root.style.overflow
    const gutter = root.style.scrollbarGutter
    root.style.scrollbarGutter = 'stable'
    root.style.overflow = 'hidden'
    element.showModal()
    closeButton.current?.focus({ preventScroll: true })
    return () => {
      element.close()
      root.style.overflow = overflow
      root.style.scrollbarGutter = gutter
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [returnFocus])

  useEffect(() => { resultsPanel.current?.scrollTo({ top: 0 }) }, [deferredQuery, role])

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${id}-title`}
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) close() }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const elements = [...event.currentTarget.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]',
        )].filter((element) => element.getClientRects().length > 0)
        const first = elements[0]
        const last = elements.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      className="fixed inset-0 m-auto h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-canvas p-0 text-ink outline-none backdrop:bg-black/65 sm:h-[min(85dvh,900px)] sm:w-[calc(100%-3rem)] sm:max-w-3xl sm:rounded-2xl sm:border sm:border-tone/15 sm:shadow-media"
    >
      <div className="flex h-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <header className="flex shrink-0 items-center justify-between gap-3 px-4 pt-4 pb-3 sm:px-6">
          <h2 id={`${id}-title`} className="text-xl font-semibold">{title} <span className="ml-1 text-base font-normal tabular-nums text-faint">{people.length}</span></h2>
          <button ref={closeButton} type="button" aria-label={messages.close} onClick={close} className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-tone/15 outline-none hover:bg-tone/7 focus-visible:ring-3 focus-visible:ring-accent/50">
            <CloseIcon className="size-5" />
          </button>
        </header>
        <div className="shrink-0 border-b border-tone/10 px-4 pb-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-faint" />
              <input
                type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                aria-label={searchLabel} placeholder={searchLabel} autoComplete="off"
                className="min-h-11 w-full rounded-xl border border-tone/15 bg-surface py-2 pr-3 pl-10 text-base outline-none focus-visible:ring-3 focus-visible:ring-accent/40"
              />
            </div>
            {kind === 'crew' ? (
              <select aria-label={messages.filterRole} value={role} onChange={(event) => setRole(event.target.value)} className="min-h-11 w-full rounded-xl border border-tone/15 bg-surface px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-accent/40 sm:w-48">
                <option value="">{messages.allRoles}</option>
                {roles.filter(({ key }) => key).map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
              </select>
            ) : null}
          </div>
          <p role="status" aria-live="polite" aria-atomic="true" className="mt-3 text-xs tabular-nums text-faint">{messages.results} {results.length} / {people.length}</p>
        </div>
        <div ref={resultsPanel} aria-busy={query !== deferredQuery} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
          {results.length ? (
            <PeopleResults key={`${deferredQuery}\u0000${role}`} people={results} locale={locale} messages={messages} onNavigate={close} />
          ) : (
            <div className="py-16 text-center">
              <p className="text-sm text-subtle">{messages.noResults}</p>
              <button type="button" onClick={() => { setQuery(''); setRole('') }} className="mt-4 min-h-11 cursor-pointer rounded-lg px-4 text-sm font-semibold text-accent-strong outline-none hover:bg-accent/10 focus-visible:ring-3 focus-visible:ring-accent/40">{messages.clearFilters}</button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}
