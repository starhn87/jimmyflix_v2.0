import { SlidersIcon } from '@/components/icons'
import {
  discoveryGenres,
  discoveryProviders,
  getDiscoveryCopy,
  type DiscoveryFilters,
} from '@/lib/discovery'
import type { Locale } from '@/lib/i18n'
import type { Region } from '@/lib/region'

const controlClassName = 'mt-2 min-h-11 w-full rounded-xl border border-tone/12 bg-canvas px-3 text-sm text-ink outline-none transition focus:border-accent/55 focus:ring-3 focus:ring-accent/20'

export function DiscoveryForm({
  locale,
  region,
  filters,
}: {
  locale: Locale
  region: Region
  filters: DiscoveryFilters
}) {
  const copy = getDiscoveryCopy(locale)
  const genres = discoveryGenres[filters.mediaType]
  const providers = discoveryProviders[region]

  return (
    <form className="grid gap-4 rounded-3xl border border-tone/10 bg-tone/4 p-5 shadow-panel sm:grid-cols-2 sm:p-6 lg:grid-cols-6" method="get">
      <label className="text-xs font-semibold text-subtle">
        {copy.mediaType}
        <select name="kind" defaultValue={filters.mediaType} className={controlClassName}>
          <option value="movie">{copy.movie}</option>
          <option value="tv">{copy.tv}</option>
        </select>
      </label>
      <label className="text-xs font-semibold text-subtle">
        {copy.genre}
        <select name="genre" defaultValue={filters.genre || ''} className={controlClassName}>
          <option value="">{copy.anyGenre}</option>
          {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre[locale]}</option>)}
        </select>
      </label>
      <label className="text-xs font-semibold text-subtle">
        {copy.runtime}
        <select name="runtime" defaultValue={filters.runtime || ''} className={controlClassName}>
          <option value="">{copy.anyRuntime}</option>
          {[90, 120, 150].map((value) => <option key={value} value={value}>{copy.minutes(value)}</option>)}
        </select>
      </label>
      <label className="text-xs font-semibold text-subtle">
        {copy.provider}
        <select name="provider" defaultValue={filters.provider || ''} className={controlClassName}>
          <option value="">{copy.anyProvider}</option>
          {providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}
        </select>
      </label>
      <label className="text-xs font-semibold text-subtle">
        {copy.rating}
        <select name="rating" defaultValue={filters.minimumRating || ''} className={controlClassName}>
          <option value="">{copy.anyRating}</option>
          {[6, 7, 8].map((value) => <option key={value} value={value}>{copy.ratingValue(value)}</option>)}
        </select>
      </label>
      <label className="text-xs font-semibold text-subtle">
        {copy.sort}
        <select name="sort" defaultValue={filters.sort} className={controlClassName}>
          <option value="popular">{copy.popular}</option>
          <option value="rated">{copy.rated}</option>
          <option value="recent">{copy.recent}</option>
        </select>
      </label>
      <div className="flex flex-col justify-end gap-2 sm:col-span-2 lg:col-span-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-xs text-faint">{copy.regionLabel(region)}</p>
        <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-action px-6 text-sm font-bold text-action-ink shadow-action outline-none transition hover:brightness-105 focus-visible:ring-3 focus-visible:ring-accent/50">
          <SlidersIcon className="size-4" />
          {copy.apply}
        </button>
      </div>
    </form>
  )
}
