'use client'

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react'

export interface DetailTab {
  id: string
  label: string
  content: ReactNode
}

interface DetailTabsProps {
  tabs: DetailTab[]
}

export function DetailTabs({ tabs }: DetailTabsProps) {
  const instanceId = useId().replaceAll(':', '')
  const [selectedId, setSelectedId] = useState(tabs[0]?.id || '')
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const selected = tabs.find((tab) => tab.id === selectedId) || tabs[0]

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
      <div className="no-scrollbar overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-1.5 shadow-xl shadow-black/20 backdrop-blur-md">
        <div role="tablist" aria-label="Title information" className="flex min-w-max gap-1">
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
                onClick={() => setSelectedId(tab.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`relative min-h-11 min-w-28 rounded-xl px-5 text-sm font-semibold outline-none transition focus-visible:ring-3 focus-visible:ring-cyan-300/40 ${
                  active
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.label}
                {active ? (
                  <span className="absolute inset-x-5 bottom-0 h-0.5 rounded-full bg-cyan-300" />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div
        id={`${instanceId}-${selected.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${instanceId}-${selected.id}-tab`}
        tabIndex={0}
        className="min-w-0 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/25"
      >
        {selected.content}
      </div>
    </div>
  )
}
