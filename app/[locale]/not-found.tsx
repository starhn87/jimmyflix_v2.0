import Image from 'next/image'
import Link from 'next/link'
import { locale as getRootLocale } from 'next/root-params'
import { BackButton } from '@/components/back-button'
import { getDictionary } from '@/lib/dictionaries'
import { defaultLocale, getLocalePath, isLocale } from '@/lib/i18n'

export default async function NotFound() {
  const value = await getRootLocale()
  const locale = isLocale(value) ? value : defaultLocale
  const dictionary = getDictionary(locale)

  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl place-items-center px-4 py-12 sm:px-6">
      <section className="grid items-center gap-8 text-center md:grid-cols-2 md:text-left">
        <Image
          src="/images/404.svg"
          alt={dictionary.notFound.imageAlt}
          width={560}
          height={420}
          preload
          className="mx-auto w-full max-w-lg"
        />
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">404</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {dictionary.notFound.title}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-subtle sm:text-base">
            {dictionary.notFound.message}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              href={getLocalePath(locale)}
              className="inline-flex min-h-11 items-center rounded-full bg-action px-5 text-sm font-semibold text-on-action outline-none transition hover:bg-action-hover focus-visible:ring-3 focus-visible:ring-accent"
            >
              {dictionary.notFound.browse}
            </Link>
            <BackButton fallbackHref={getLocalePath(locale)} label={dictionary.common.goBack} />
          </div>
        </div>
      </section>
    </main>
  )
}
