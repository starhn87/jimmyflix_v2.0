import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import type { Locale } from '@/lib/i18n'
import { getBreadcrumbJsonLd, type BreadcrumbItem } from '@/lib/structured-data'

export function Breadcrumbs({ items, locale }: { items: BreadcrumbItem[]; locale: Locale }) {
  return (
    <>
      <JsonLd data={getBreadcrumbJsonLd(items)} />
      <nav aria-label={locale === 'ko' ? '탐색 경로' : 'Breadcrumb'} className="mb-3 text-xs text-subtle">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, index) => (
            <li key={item.href} className="inline-flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {index === items.length - 1
                ? <span aria-current="page">{item.name}</span>
                : <Link href={item.href} prefetch={false} className="rounded-sm hover:text-ink focus-visible:outline-accent">{item.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
