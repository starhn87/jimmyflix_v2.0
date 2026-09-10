'use client'

interface GlobalErrorProps {
  reset: () => void
}

export default function Error({ reset }: GlobalErrorProps) {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12 sm:px-6 lg:px-10">
      <section
        role="alert"
        className="flex min-h-72 w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-400/5 p-8 text-center sm:p-12"
      >
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">Something went wrong</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
          Jimmyflix couldn’t load this page. Try the request again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-cyan-300 px-5 text-sm font-semibold text-slate-950 outline-none transition hover:bg-cyan-200 focus-visible:ring-3 focus-visible:ring-cyan-100"
        >
          Try again
        </button>
      </section>
    </main>
  )
}
