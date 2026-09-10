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
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-slate-200 outline-none transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-cyan-300/35"
    >
      <ArrowLeftIcon className="size-4" />
      Go back
    </button>
  )
}
