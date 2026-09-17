import Link from 'next/link'
import type { ReactNode } from 'react'
import { LoadingCardImage } from '@/components/loading-card-image'
import { DetailCardRail } from '@/components/detail-card-rail'
import { panelHeading, EmptyPanel } from '@/components/detail/panel-primitives'
import { getImageUrl } from '@/lib/media'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { MediaDetail, ProductionCompany, ProductionCountry, WatchProvider, WatchProviderRegion } from '@/types/tmdb'

function CompanyCard({ company }: { company: ProductionCompany }) {
  return (
    <li className="w-60 shrink-0 snap-start">
      <div className="flex h-24 items-center gap-3 rounded-xl border border-tone/10 bg-tone/3 p-3">
        <LoadingCardImage
          src={getImageUrl(company.logo_path, 'w300') || '/images/defaultProduction.png'}
          alt={company.name}
          sizes="64px"
          imageClassName="object-contain object-center p-2"
          containerClassName="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100"
        />
        <p className="line-clamp-3 text-sm leading-5 font-medium text-muted" title={company.name}>{company.name}</p>
      </div>
    </li>
  )
}

function CountryCard({ country, flagAlt }: { country: ProductionCountry; flagAlt: string }) {
  return (
    <li className="inline-flex min-h-10 items-center gap-2 rounded-full border border-tone/10 bg-tone/3 px-3 py-2">
      <LoadingCardImage
        src={`https://flagcdn.com/w80/${country.iso_3166_1.toLowerCase()}.png`}
        alt={flagAlt}
        sizes="24px"
        imageClassName="object-contain object-center"
        containerClassName="relative aspect-5/3 w-6 shrink-0 overflow-hidden rounded-xs bg-surface"
      />
      <span className="text-sm leading-5 text-muted">{country.name}</span>
    </li>
  )
}

const uniqueProviders = (providers: WatchProvider[]) => {
  const seen = new Set<number>()
  return providers.filter((provider) => {
    if (seen.has(provider.provider_id)) return false
    seen.add(provider.provider_id)
    return true
  })
}

function ProviderGroup({
  title,
  providers,
  link,
  locale,
}: {
  title: string
  providers: WatchProvider[]
  link: string
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-3">
        {uniqueProviders(providers).map((provider) => (
          <li key={provider.provider_id} className="w-20 text-center sm:w-24">
            <Link
              href={link}
              target="_blank"
              rel="noreferrer"
              aria-label={dictionary.detail.watchOn(provider.provider_name)}
              className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-accent/50"
            >
              <LoadingCardImage
                src={getImageUrl(provider.logo_path, 'w300') || '/images/defaultProduction.png'}
                alt={provider.provider_name}
                sizes="96px"
                imageClassName="object-cover object-center"
                containerClassName="relative mx-auto aspect-square w-16 overflow-hidden rounded-2xl border border-tone/10 bg-surface shadow-panel sm:w-20"
              />
              <p className="mt-2 line-clamp-2 text-xs leading-4 text-muted transition-colors group-hover:text-accent-strong">
                {provider.provider_name}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function WatchProvidersPanel({ providers, locale }: { providers?: WatchProviderRegion | null; locale: Locale }) {
  const dictionary = getDictionary(locale)
  const groups = providers ? [
    {
      title: dictionary.detail.stream,
      providers: [...(providers.flatrate || []), ...(providers.free || []), ...(providers.ads || [])],
    },
    { title: dictionary.detail.rent, providers: providers.rent || [] },
    { title: dictionary.detail.buy, providers: providers.buy || [] },
  ].filter((group) => group.providers.length > 0) : []

  if (!providers || !groups.length) return null
  return (
    <section aria-labelledby="watch-providers-title">
      <h2 id="watch-providers-title" className={panelHeading}>{dictionary.detail.streamingAvailability}</h2>
      <div className="mt-5 grid gap-7 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {groups.map((group) => <ProviderGroup key={group.title} title={group.title} providers={group.providers} link={providers.link} locale={locale} />)}
      </div>
      <Link href="https://www.justwatch.com/" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-xs text-faint underline decoration-tone/30 underline-offset-4 transition hover:text-ink">
        {dictionary.detail.justWatchAttribution}
      </Link>
    </section>
  )
}

export function ProductionEmptyPanel({ locale }: { locale: Locale }) {
  return <EmptyPanel message={getDictionary(locale).detail.noProduction} />
}

export function ProductionPanel({ detail, crewPanel, providersPanel, emptyPanel, locale }: {
  detail: MediaDetail
  crewPanel: ReactNode
  providersPanel: ReactNode
  emptyPanel: ReactNode
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  const companies = detail.production_companies || []
  const countries = detail.production_countries || []
  return (
    <div className="min-w-0 space-y-8 pt-7">
      {crewPanel}
      {companies.length > 0 ? (
        <DetailCardRail title={dictionary.detail.productionCompanies} count={companies.length} previousLabel={`${dictionary.detail.productionCompanies}: ${dictionary.detail.peopleUi.previous}`} nextLabel={`${dictionary.detail.productionCompanies}: ${dictionary.detail.peopleUi.next}`}>
          {companies.map((company) => <CompanyCard key={company.id} company={company} />)}
        </DetailCardRail>
      ) : null}
      {countries.length > 0 ? (
        <section aria-labelledby="countries-title">
          <h2 id="countries-title" className={panelHeading}>{dictionary.detail.productionCountries}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {countries.map((country) => <CountryCard key={country.iso_3166_1} country={country} flagAlt={dictionary.detail.flagAlt(country.name)} />)}
          </ul>
        </section>
      ) : null}
      {providersPanel}
      {emptyPanel}
    </div>
  )
}
