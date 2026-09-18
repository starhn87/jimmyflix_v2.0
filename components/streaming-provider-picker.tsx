'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLayoutEffect, useRef } from 'react'
import { STREAMING_PROVIDER_LIST_CLASS_NAME } from '@/components/media-rail-styles'
import { getImageUrl } from '@/lib/media'
import type { StreamingProviderOption } from '@/types/tmdb'

interface StreamingProviderPickerProps {
  providers: StreamingProviderOption[]
  selectedProviderId: number
  pathname: string
  sectionId: string
  label: string
  pending: boolean
  onSelect: (id: number, href: string) => void
  onPrefetch: (id: number) => void
}

export function StreamingProviderPicker({
  providers,
  selectedProviderId,
  pathname,
  sectionId,
  label,
  pending,
  onSelect,
  onPrefetch,
}: StreamingProviderPickerProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const indicatorRef = useRef<HTMLLIElement>(null)

  useLayoutEffect(() => {
    const list = listRef.current
    const indicator = indicatorRef.current
    const selected = list?.querySelector<HTMLElement>(`[data-provider-id="${selectedProviderId}"]`)
    if (!list || !indicator || !selected) return

    const positionIndicator = () => {
      const initial = !list.hasAttribute('data-indicator-ready')
      const { offsetWidth, offsetHeight, offsetLeft } = selected
      if (initial) indicator.style.transition = 'none'
      indicator.style.width = `${offsetWidth}px`
      indicator.style.height = `${offsetHeight}px`
      indicator.style.transform = `translateX(${offsetLeft}px)`
      if (initial) {
        // Place the first highlight before enabling motion between subsequent tabs.
        indicator.getBoundingClientRect()
        indicator.style.transition = ''
        list.setAttribute('data-indicator-ready', '')
      }
    }

    positionIndicator()
    const observer = new ResizeObserver(positionIndicator)
    observer.observe(list)
    for (const item of list.querySelectorAll<HTMLElement>('[data-provider-id]')) observer.observe(item)
    return () => observer.disconnect()
  }, [selectedProviderId, providers])

  return (
    <nav aria-label={label} aria-busy={pending} data-selected={selectedProviderId}>
      <ul ref={listRef} className={`streaming-provider-tabs relative isolate no-scrollbar scroll-px-4 overflow-x-auto sm:scroll-px-0 ${STREAMING_PROVIDER_LIST_CLASS_NAME}`}>
        <li ref={indicatorRef} aria-hidden="true" className="streaming-provider-indicator pointer-events-none absolute top-0 left-0 rounded-full border border-accent/55 bg-accent/18 shadow-panel" />
        {providers.map((provider) => {
          const active = provider.provider_id === selectedProviderId
          const href = `${pathname}?provider=${provider.provider_id}#${sectionId}`
          const logo = getImageUrl(provider.logo_path, 'w92')
          const prefetch = () => {
            if (!active) onPrefetch(provider.provider_id)
          }

          return (
            <li key={provider.provider_id} data-provider-id={provider.provider_id} className="relative z-10 shrink-0">
              <Link
                href={href}
                scroll={false}
                prefetch={false}
                onPointerEnter={prefetch}
                onFocus={prefetch}
                onTouchStart={prefetch}
                onNavigate={(event) => {
                  event.preventDefault()
                  if (active) return
                  onSelect(provider.provider_id, href)
                }}
                aria-current={active ? 'true' : undefined}
                className={`streaming-provider-tab inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-accent/40 ${
                  active
                    ? 'border-transparent text-ink'
                    : 'border-tone/10 bg-tone/4 text-subtle hover:border-accent/25 hover:bg-tone/8 hover:text-ink'
                }`}
              >
                {logo ? <Image src={logo} alt="" width={24} height={24} unoptimized className="size-6 rounded-md" /> : null}
                <span>{provider.provider_name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
