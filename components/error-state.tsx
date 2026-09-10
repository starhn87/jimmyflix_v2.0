import Link from 'next/link'
import { RetryButton } from '@/components/retry-button'

interface ErrorStateProps {
  title: string
  message?: string
  compact?: boolean
  backHref?: string
  backLabel?: string
  retry?: boolean
}

export function ErrorState({
  title,
  message = 'Check your connection and try again.',
  compact = false,
  backHref,
  backLabel = 'Back to browse',
  retry = true,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className={`mx-auto flex w-full flex-col items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-400/5 text-center ${
        compact ? 'min-h-40 p-6' : 'my-16 min-h-72 max-w-3xl p-8 sm:p-12'
      }`}
    >
      <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {retry ? <RetryButton /> : null}
        {backHref ? (
          <Link
            href={backHref}
            className="mt-5 inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-sm font-semibold text-slate-200 outline-none transition hover:bg-white/8 focus-visible:ring-3 focus-visible:ring-cyan-300/35"
          >
            {backLabel}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
