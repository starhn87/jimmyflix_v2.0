'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { RefreshIcon } from '@/components/icons'

export function RetryButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
      className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 text-sm font-semibold text-accent-strong outline-none transition hover:bg-accent/20 focus-visible:ring-3 focus-visible:ring-accent/35 disabled:cursor-wait disabled:opacity-60"
    >
      <RefreshIcon className={`size-4 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? 'Trying again…' : 'Try again'}
    </button>
  )
}
