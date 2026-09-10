'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@/components/icons'

interface BackButtonProps {
  fallbackHref?: string
}

export function BackButton({ fallbackHref = '/' }: BackButtonProps) {
  const router = useRouter()

  const goBack = () => {
    if (document.referrer && window.history.length > 1) {
      const referrer = new URL(document.referrer)
      if (referrer.origin === window.location.origin) {
        router.back()
        return
      }
    }

    router.push(fallbackHref)
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-tone/15 bg-tone/5 px-5 text-sm font-semibold text-muted outline-none transition hover:border-tone/25 hover:bg-tone/10 hover:text-ink focus-visible:ring-3 focus-visible:ring-accent/35"
    >
      <ArrowLeftIcon className="size-4" />
      Go back
    </button>
  )
}
