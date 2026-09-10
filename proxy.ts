import { NextRequest, NextResponse } from 'next/server'
import {
  defaultLocale,
  getLocalePath,
  isLocale,
  localeCookieName,
  type Locale,
} from '@/lib/i18n'

const ONE_YEAR = 60 * 60 * 24 * 365

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(localeCookieName)?.value
  if (isLocale(saved)) return saved

  const weightedLanguages = (request.headers.get('accept-language') || '')
    .split(',')
    .map((entry) => {
      const [language, quality = 'q=1'] = entry.trim().split(';')
      return {
        language: language.toLowerCase(),
        quality: Number(quality.replace(/^q=/, '')) || 0,
      }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { language } of weightedLanguages) {
    if (language === 'ko' || language.startsWith('ko-')) return 'ko'
    if (language === 'en' || language.startsWith('en-')) return 'en'
  }

  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segment = pathname.split('/')[1]

  if (isLocale(segment)) {
    const response = NextResponse.next()
    if (request.cookies.get(localeCookieName)?.value !== segment) {
      response.cookies.set(localeCookieName, segment, {
        maxAge: ONE_YEAR,
        path: '/',
        sameSite: 'lax',
      })
    }
    return response
  }

  const locale = preferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = getLocalePath(locale, pathname)

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)'],
}
