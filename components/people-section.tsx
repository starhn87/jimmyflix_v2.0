'use client'

import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { DetailCardRail } from '@/components/detail-card-rail'
import { DetailPersonCard } from '@/components/detail-person-card'
import { ArrowRightIcon } from '@/components/icons'
import { PERSON_RAIL_ITEM } from '@/components/detail-rail-styles'
import { PEOPLE_PREVIEW_LIMIT, type DetailPerson, type PeopleMessages } from '@/lib/detail-people'
import type { Locale } from '@/lib/i18n'

const loadDialog = () => import('@/components/people-dialog').then((module) => module.PeopleDialog)
const PeopleDialog = dynamic(loadDialog)

export function PeopleSection({ people, title, kind, locale, messages }: {
  people: DetailPerson[]
  title: string
  kind: 'cast' | 'crew'
  locale: Locale
  messages: PeopleMessages
}) {
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  return (
    <>
      <DetailCardRail
        title={title}
        count={people.length}
        previousLabel={`${title}: ${messages.previous}`}
        nextLabel={`${title}: ${messages.next}`}
        action={(
          <button
            ref={opener}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`${title}: ${messages.viewAll}`}
            onFocus={() => { void loadDialog() }}
            onPointerEnter={() => { void loadDialog() }}
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-lg px-1 text-sm font-semibold whitespace-nowrap text-accent-strong outline-none hover:text-ink focus-visible:ring-3 focus-visible:ring-accent/50"
          >
            {messages.viewAll}<ArrowRightIcon className="size-4" />
          </button>
        )}
      >
        {people.slice(0, PEOPLE_PREVIEW_LIMIT).map((person) => (
          <li key={person.id} className={PERSON_RAIL_ITEM}><DetailPersonCard person={person} locale={locale} /></li>
        ))}
      </DetailCardRail>
      {open ? <PeopleDialog people={people} title={title} kind={kind} locale={locale} messages={messages} returnFocus={opener} onClose={() => setOpen(false)} /> : null}
    </>
  )
}
