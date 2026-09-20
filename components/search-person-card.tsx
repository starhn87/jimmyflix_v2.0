import Link from 'next/link'
import { LoadingCardImage } from '@/components/loading-card-image'
import { getLocalePath, type Locale } from '@/lib/i18n'
import { getProfileUrl } from '@/lib/media'
import type { PersonSearchResult } from '@/types/tmdb'

export function SearchPersonCard({
  person,
  locale,
  typeLabel,
}: {
  person: Pick<PersonSearchResult, 'id' | 'name' | 'profile_path'>
  locale: Locale
  typeLabel: string
}) {
  return (
    <Link
      href={getLocalePath(locale, `/people/${person.id}`)}
      prefetch={false}
      aria-label={`${person.name}, ${typeLabel}`}
      className="group flex min-h-28 items-center gap-4 rounded-2xl border border-tone/10 bg-tone/4 p-3 outline-none transition-colors hover:border-accent/45 hover:bg-tone/7 focus-visible:ring-3 focus-visible:ring-accent/50"
    >
      <LoadingCardImage
        src={getProfileUrl(person.profile_path)}
        tmdbKind="profile"
        alt=""
        sizes="64px"
        imageClassName="object-cover object-center transition-transform duration-300 group-hover:scale-[1.035] motion-reduce:transform-none"
        containerClassName="relative aspect-2/3 w-16 shrink-0 overflow-hidden rounded-xl bg-surface"
      />
      <div className="min-w-0">
        <p className="text-xs font-medium text-faint">{typeLabel}</p>
        <p className="mt-1 wrap-anywhere font-semibold text-ink transition-colors group-hover:text-accent-strong">{person.name}</p>
      </div>
    </Link>
  )
}
