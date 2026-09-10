'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { HeaderSearch, HeaderSearchControl } from '@/components/header-search'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { getLocalePath, type HeaderMessages, type Locale } from '@/lib/i18n'

export function SiteHeader({ locale, messages }: { locale: Locale; messages: HeaderMessages }) {
  const pathname = usePathname()
  const routePath = pathname.replace(/^\/(?:en|ko)(?=\/|$)/, '') || '/'
  const navigation = [
    { href: '/', label: messages.movies, match: routePath === '/' || routePath.startsWith('/movies') },
    { href: '/tvs', label: messages.tv, match: routePath.startsWith('/tvs') },
    { href: '/trend', label: messages.trend, match: routePath.startsWith('/trend') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-tone/8 bg-canvas/90 shadow-header backdrop-blur-xl">
      <div className="mx-auto grid min-h-18 max-w-[1600px] grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-0 px-4 max-[369px]:gap-y-1 max-[369px]:py-2 sm:gap-x-3 sm:px-6 lg:min-h-20 lg:grid-cols-[auto_minmax(0,1fr)_minmax(260px,320px)_auto] lg:px-10">
        <Link
          href={getLocalePath(locale)}
          prefetch={false}
          aria-label={messages.home}
          className="group order-1 my-3 flex shrink-0 items-center gap-2 rounded-lg text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="grid size-9 place-items-center transition-transform group-hover:scale-105 sm:size-10">
            <Image
              src="/icon.svg"
              alt=""
              width={40}
              height={40}
              sizes="40px"
              loading="eager"
              unoptimized
            />
          </span>
          <span className="hidden font-mono text-lg font-semibold tracking-tight sm:inline">
            Jimmyflix
          </span>
        </Link>

        <nav aria-label={messages.primaryNavigation} className="order-2 min-w-0 max-[369px]:order-5 max-[369px]:col-span-full max-[369px]:row-start-2">
          <ul className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-5">
            {navigation.map((item) => {
              const current = item.match
              return (
                <li key={item.href}>
                  <Link
                    href={getLocalePath(locale, item.href)}
                    prefetch={false}
                    aria-current={current ? 'page' : undefined}
                    className={`relative flex min-h-11 min-w-12 items-center justify-center rounded-lg px-1 text-[0.8rem] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent sm:min-w-20 sm:px-4 sm:text-sm lg:min-w-28 lg:text-base ${
                      current
                        ? 'text-ink'
                        : 'text-subtle hover:bg-tone/5 hover:text-ink'
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                      {current ? (
                        <span aria-hidden="true" className="absolute -inset-x-1 -bottom-3 h-0.5 rounded-full bg-action shadow-[0_0_12px_rgba(167,139,250,0.72)]" />
                      ) : null}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <Suspense fallback={<HeaderSearchControl locale={locale} messages={messages} expanded={routePath === '/search'} />}>
          <HeaderSearch locale={locale} messages={messages} pathname={routePath} />
        </Suspense>
        <div className="order-4 flex items-center gap-1 sm:gap-2">
          <LocaleSwitcher
            locale={locale}
            label={messages.switchLanguage}
            buttonLabel={messages.languageButton}
          />
          <ThemeToggle messages={messages} />
        </div>
      </div>
    </header>
  )
}
