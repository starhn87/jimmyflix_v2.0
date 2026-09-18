import 'server-only'

import { cookies } from 'next/headers'
import type { Locale } from '@/lib/i18n'
import { getDefaultRegion, isRegion, regionCookieName, type Region } from '@/lib/region'

export async function getRequestRegion(locale: Locale): Promise<Region> {
  const saved = (await cookies()).get(regionCookieName)?.value
  return isRegion(saved) ? saved : getDefaultRegion(locale)
}
