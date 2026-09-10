import Image from 'next/image'
import Link from 'next/link'
import { BackButton } from '@/components/back-button'

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl place-items-center px-4 py-12 sm:px-6">
      <section className="grid items-center gap-8 text-center md:grid-cols-2 md:text-left">
        <Image
          src="/images/404.svg"
          alt="Page not found illustration"
          width={560}
          height={420}
          preload
          className="mx-auto w-full max-w-lg"
        />
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">404</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            That title slipped away
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
            The page may have moved, or the title is no longer available.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full bg-cyan-300 px-5 text-sm font-semibold text-slate-950 outline-none transition hover:bg-cyan-200 focus-visible:ring-3 focus-visible:ring-cyan-100"
            >
              Browse movies
            </Link>
            <BackButton />
          </div>
        </div>
      </section>
    </main>
  )
}
