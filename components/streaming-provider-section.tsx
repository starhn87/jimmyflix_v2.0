import 'server-only'

import Image from 'next/image'
import Link from 'next/link'
import { MediaSection } from '@/components/media-section'
import { getDictionary } from '@/lib/dictionaries'
import { getLocalePath, type Locale } from '@/lib/i18n'
import { getImageUrl } from '@/lib/media'
import type { StreamingDiscoveryData } from '@/types/tmdb'

interface StreamingProviderSectionProps {
  request: Promise<StreamingDiscoveryData>
  locale: Locale
  basePath: '/' | '/tv'
}

export async function StreamingProviderSection({
  request,
  locale,
  basePath,
}: StreamingProviderSectionProps) {
  const dictionary = getDictionary(locale)
  const data = await request

  const providerPicker = (
    <nav aria-label={dictionary.sections.providerPickerLabel}>
      <ul className="no-scrollbar flex max-w-full gap-2 overflow-x-auto pb-1">
        {data.providers.map((provider) => {
          const logo = getImageUrl(provider.logo_path, 'w185')

          return (
            <li key={provider.provider_id} className="shrink-0">
              <Link
                href={{
                  pathname: getLocalePath(locale, basePath),
                  query: { provider: provider.provider_id },
                  hash: data.section.id,
                }}
                scroll={false}
                prefetch={false}
                aria-current={provider.selected ? 'true' : undefined}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm font-semibold outline-none transition focus-visible:ring-3 focus-visible:ring-accent/40 ${
                  provider.selected
                    ? 'border-accent/55 bg-accent/18 text-ink shadow-panel'
                    : 'border-tone/10 bg-tone/4 text-subtle hover:border-accent/25 hover:bg-tone/8 hover:text-ink'
                }`}
              >
                {logo ? (
                  <Image
                    src={logo}
                    alt=""
                    width={24}
                    height={24}
                    quality={85}
                    className="size-6 rounded-md"
                  />
                ) : null}
                <span>{provider.provider_name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  const attribution = (
    <Link
      href="https://www.justwatch.com/"
      target="_blank"
      rel="noreferrer"
      className="text-xs text-faint underline decoration-tone/25 underline-offset-4 transition hover:text-ink"
    >
      {dictionary.sections.justWatchDiscoveryAttribution}
    </Link>
  )

  return (
    <MediaSection
      section={data.section}
      locale={locale}
      toolbar={providerPicker}
      description={attribution}
    />
  )
}
