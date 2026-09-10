export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading content" className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10">
      <span className="sr-only">Loading…</span>
      <div className="h-64 animate-pulse rounded-3xl bg-white/6 sm:h-96" />
      <div className="mt-12 h-7 w-48 animate-pulse rounded-lg bg-white/8" />
      <div className="mt-6 flex gap-4 overflow-hidden">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="aspect-2/3 w-[42vw] min-w-[136px] max-w-[190px] shrink-0 animate-pulse rounded-xl bg-white/6" />
        ))}
      </div>
    </main>
  )
}
