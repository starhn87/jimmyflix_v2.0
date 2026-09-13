import Link from 'next/link'
import { LoadingCardImage } from '@/components/loading-card-image'
import { PERSON_CARD_NAME, PERSON_CARD_ROLE } from '@/components/detail-rail-styles'
import type { DetailPerson } from '@/lib/detail-people'
import { getLocalePath, type Locale } from '@/lib/i18n'
import { getProfileUrl } from '@/lib/media'

export function DetailPersonCard({ person, locale, compact = false, onNavigate }: {
  person: DetailPerson
  locale: Locale
  compact?: boolean
  onNavigate?: () => void
}) {
  const roles = person.roles.map(({ label }) => label).join(' · ')
  return (
    <Link
      href={getLocalePath(locale, `/people/${person.id}`)}
      prefetch={false}
      onNavigate={onNavigate}
      className={`group rounded-xl outline-none transition-colors focus-visible:ring-3 focus-visible:ring-accent/50 ${compact ? 'flex h-full items-center gap-4 border border-tone/8 bg-tone/3 p-3 hover:bg-tone/7' : 'block text-center'}`}
    >
      <LoadingCardImage
        src={getProfileUrl(person.profilePath)}
        alt={person.name}
        sizes={compact ? '56px' : '(max-width: 639px) 128px, 160px'}
        imageClassName="object-cover object-center transition-transform duration-300 group-hover:scale-[1.035] motion-reduce:transform-none"
        containerClassName={`relative aspect-2/3 overflow-hidden rounded-xl border border-tone/8 bg-surface ${compact ? 'w-14 shrink-0' : 'w-full shadow-panel'}`}
      />
      <div className="min-w-0">
        <p title={person.name} className={`${compact ? 'text-sm leading-5 font-semibold text-ink' : PERSON_CARD_NAME} transition-colors group-hover:text-accent-strong`}>{person.name}</p>
        <p title={roles} className={compact ? 'mt-1 text-xs leading-5 wrap-anywhere text-faint' : PERSON_CARD_ROLE}>{roles}</p>
      </div>
    </Link>
  )
}
