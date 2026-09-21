'use server'

import { cookies } from 'next/headers'
import {
  isRegion,
  regionCookieMaxAge,
  regionCookieName,
  type Region,
} from '@/lib/region'

export async function setRegionPreference(region: Region) {
  if (!isRegion(region)) throw new Error('Unsupported watch region.')

  const cookieStore = await cookies()
  cookieStore.set(regionCookieName, region, {
    path: '/',
    maxAge: regionCookieMaxAge,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    priority: 'medium',
  })
}
