'use client'

import { useParams } from 'next/navigation'

interface GlobalErrorProps {
  reset: () => void
}

export default function Error({ reset }: GlobalErrorProps) {
  const { locale } = useParams<{ locale?: string }>()
  const korean = locale === 'ko'

  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12 sm:px-6 lg:px-10">
      <section
        role="alert"
        className="flex min-h-72 w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-400/5 p-8 text-center sm:p-12"
      >
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
          {korean ? '문제가 발생했습니다' : 'Something went wrong'}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-subtle sm:text-base">
          {korean
            ? 'Jimmyflix가 이 페이지를 불러오지 못했습니다. 다시 시도해 주세요.'
            : 'Jimmyflix couldn’t load this page. Try the request again.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-action px-5 text-sm font-semibold text-on-action outline-none transition hover:bg-action-hover focus-visible:ring-3 focus-visible:ring-accent"
        >
          {korean ? '다시 시도' : 'Try again'}
        </button>
      </section>
    </main>
  )
}
