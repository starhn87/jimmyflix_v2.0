'use client'

import {
  type KeyboardEvent,
  type ReactNode,
  useDeferredValue,
  useId,
  useRef,
  useState,
} from 'react'
import { useHorizontalScroll } from '@/components/use-horizontal-scroll'
import { getScrollBehavior } from '@/lib/browser-motion'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'

export interface DetailTab {
  id: string
  label: string
  content: ReactNode
}

interface DetailTabsProps {
  tabs: DetailTab[]
  label: string
  scrollBackwardLabel: string
  scrollForwardLabel: string
}

export function DetailTabs({
  tabs,
  label,
  scrollBackwardLabel,
  scrollForwardLabel,
}: DetailTabsProps) {
  const instanceId = useId().replaceAll(':', '')
  const [selectedId, setSelectedId] = useState(tabs[0]?.id || '')
  const renderedId = useDeferredValue(selectedId)
  const { track: scroller, edges, scroll } = useHorizontalScroll<HTMLDivElement>(tabs.length)
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const selected = tabs.find((tab) => tab.id === selectedId) || tabs[0]
  const rendered = tabs.find((tab) => tab.id === renderedId) || selected
  const tabListId = `${instanceId}-tab-list`

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1

    if (nextIndex === index) return

    event.preventDefault()
    const nextTab = tabs[nextIndex]
    setSelectedId(nextTab.id)
    buttons.current[nextIndex]?.focus()
  }

  if (!selected) return null

  return (
    <div>
      <div className="relative">
        <div
          ref={scroller}
          className="no-scrollbar overflow-x-auto rounded-2xl border border-tone/10 bg-overlay p-1.5 shadow-panel backdrop-blur-md"
        >
          <div id={tabListId} role="tablist" aria-label={label} className="flex min-w-max gap-1">
            {tabs.map((tab, index) => {
              const active = selected.id === tab.id
              const tabId = `${instanceId}-${tab.id}-tab`
              const panelId = `${instanceId}-${tab.id}-panel`

              return (
                <button
                  key={tab.id}
                  ref={(element) => {
                    buttons.current[index] = element
                  }}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={panelId}
                  tabIndex={active ? 0 : -1}
                  onClick={(event) => {
                    setSelectedId(tab.id)
                    event.currentTarget.scrollIntoView({ behavior: getScrollBehavior(), block: 'nearest', inline: 'center' })
                  }}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={`min-h-11 min-w-28 rounded-xl px-5 text-sm font-semibold outline-none transition focus-visible:ring-3 focus-visible:ring-accent/40 ${
                    active
                      ? 'bg-tone/10 text-ink shadow-inner'
                      : 'text-subtle hover:bg-tone/5 hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {edges.previous ? (
          <>
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-px left-px w-16 rounded-l-2xl bg-gradient-to-r from-canvas via-canvas/85 to-transparent sm:hidden" />
            <button
              type="button"
              aria-label={scrollBackwardLabel}
              aria-controls={tabListId}
              onClick={() => scroll(-1, 0.72, 160)}
              className="absolute top-1/2 left-2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-tone/15 bg-canvas/92 text-ink shadow-panel outline-none transition hover:bg-surface focus-visible:ring-3 focus-visible:ring-accent/40 sm:hidden"
            >
              <ArrowLeftIcon className="size-5" />
            </button>
          </>
        ) : null}

        {edges.next ? (
          <>
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-px right-px w-16 rounded-r-2xl bg-gradient-to-l from-canvas via-canvas/85 to-transparent sm:hidden" />
            <button
              type="button"
              aria-label={scrollForwardLabel}
              aria-controls={tabListId}
              onClick={() => scroll(1, 0.72, 160)}
              className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-tone/15 bg-canvas/92 text-ink shadow-panel outline-none transition hover:bg-surface focus-visible:ring-3 focus-visible:ring-accent/40 sm:hidden"
            >
              <ArrowRightIcon className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      <div
        id={`${instanceId}-${selected.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${instanceId}-${selected.id}-tab`}
        aria-busy={selected.id !== rendered.id}
        tabIndex={0}
        className="min-w-0 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-accent/25"
      >
        {rendered.content}
      </div>
    </div>
  )
}
