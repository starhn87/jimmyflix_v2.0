const cardPlaceholders = Array.from({ length: 8 })
const linePlaceholders = Array.from({ length: 3 })

function Bone({ className }: { className: string }) {
  return <div className={`bg-white/7 ${className}`} />
}

function LoadingAnnouncement({ label }: { label: string }) {
  return <span className="sr-only">{label}</span>
}

function MediaRailSkeleton() {
  return (
    <section aria-hidden="true">
      <div className="mb-5 px-4 sm:px-6 lg:px-10">
        <Bone className="h-7 w-40 rounded-lg sm:w-52" />
        <Bone className="mt-2 h-4 w-56 max-w-[70vw] rounded-md" />
      </div>
      <ul className="flex gap-3 overflow-hidden px-4 pb-7 sm:gap-4 sm:px-6 lg:gap-5 lg:px-10">
        {cardPlaceholders.map((_, index) => (
          <li
            key={index}
            className="w-[42vw] min-w-[136px] max-w-[190px] shrink-0 sm:w-[27vw] md:w-[20vw] lg:w-[15vw] xl:w-[13vw]"
          >
            <Bone className="aspect-2/3 w-full rounded-xl" />
            <Bone className="mt-3 h-4 w-4/5 rounded-md" />
            <Bone className="mt-2 h-3 w-2/5 rounded-md" />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function CatalogSkeleton({ label }: { label: string }) {
  return (
    <main aria-busy="true" aria-live="polite" aria-label={label}>
      <LoadingAnnouncement label={label} />
      <div className="animate-pulse motion-reduce:animate-none">
        <section aria-hidden="true" className="relative min-h-[520px] overflow-hidden sm:min-h-[600px] lg:min-h-[680px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(34,211,238,0.09),rgba(8,11,18,0.5)_54%,#080b12_86%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#0d1420]/65 to-[#0d1420]/30" />
          <div className="relative mx-auto flex min-h-[520px] max-w-[1600px] items-end px-4 pb-20 sm:min-h-[600px] sm:px-6 sm:pb-24 lg:min-h-[680px] lg:px-10 lg:pb-28">
            <div className="w-full max-w-2xl">
              <Bone className="h-3 w-32 rounded-full" />
              <Bone className="mt-5 h-11 w-4/5 max-w-xl rounded-xl sm:h-16" />
              <div className="mt-5 flex gap-2">
                <Bone className="h-8 w-24 rounded-full" />
                <Bone className="h-8 w-16 rounded-full" />
              </div>
              <div className="mt-5 max-w-xl space-y-2.5">
                <Bone className="h-4 w-full rounded-md" />
                <Bone className="h-4 w-5/6 rounded-md" />
              </div>
              <Bone className="mt-7 h-12 w-36 rounded-full" />
            </div>
          </div>
        </section>
        <div className="relative z-10 -mt-8 space-y-10 pb-20 sm:space-y-14">
          {Array.from({ length: 4 }, (_, index) => <MediaRailSkeleton key={index} />)}
        </div>
      </div>
    </main>
  )
}

export function MediaSectionsSkeleton({
  label,
  count = 2,
}: {
  label: string
  count?: number
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className="animate-pulse space-y-10 motion-reduce:animate-none sm:space-y-14"
    >
      <LoadingAnnouncement label={label} />
      {Array.from({ length: count }, (_, index) => <MediaRailSkeleton key={index} />)}
    </div>
  )
}

function ResultGridSkeleton() {
  return (
    <section aria-hidden="true">
      <Bone className="mb-5 h-7 w-32 rounded-lg" />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {cardPlaceholders.map((_, index) => (
          <li key={index} className="min-w-0">
            <Bone className="aspect-2/3 w-full rounded-xl" />
            <Bone className="mt-3 h-4 w-4/5 rounded-md" />
            <Bone className="mt-2 h-3 w-2/5 rounded-md" />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function SearchResultsSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading search results"
      className="mx-auto max-w-[1600px] animate-pulse px-4 motion-reduce:animate-none sm:px-6 lg:px-10"
    >
      <LoadingAnnouncement label="Loading search results" />
      <Bone className="mb-8 h-4 w-24 rounded-md" />
      <div className="space-y-14">
        <ResultGridSkeleton />
        <ResultGridSkeleton />
      </div>
    </div>
  )
}

export function DetailSkeleton({ label }: { label: string }) {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#080b12]"
    >
      <LoadingAnnouncement label={label} />
      <div className="animate-pulse motion-reduce:animate-none">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-[780px] bg-[radial-gradient(circle_at_72%_20%,rgba(34,211,238,0.08),transparent_45%),linear-gradient(to_bottom,rgba(18,27,40,0.8),#080b12)] md:block" />
        <div aria-hidden="true" className="relative mx-auto grid max-w-[1480px] grid-cols-[112px_minmax(0,1fr)] items-start gap-x-4 gap-y-6 px-4 py-8 sm:grid-cols-[150px_minmax(0,1fr)] sm:px-6 md:py-12 lg:grid-cols-[minmax(280px,390px)_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-8 lg:px-10">
          <Bone className="aspect-2/3 w-full rounded-2xl lg:row-span-3" />

          <header className="min-w-0 pt-1 lg:pt-4">
            <Bone className="h-8 w-4/5 max-w-xl rounded-lg sm:h-11 lg:h-16" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Bone className="h-8 w-24 rounded-full" />
              <Bone className="h-8 w-16 rounded-full" />
              <Bone className="h-8 w-20 rounded-full" />
              <Bone className="h-8 w-28 rounded-full" />
            </div>
          </header>

          <div className="col-span-2 max-w-[76ch] space-y-3 lg:col-span-1 lg:col-start-2">
            {linePlaceholders.map((_, index) => (
              <Bone key={index} className={`h-4 rounded-md ${index === 2 ? 'w-3/4' : 'w-full'}`} />
            ))}
          </div>

          <div className="col-span-2 min-w-0 pb-16 lg:col-span-1 lg:col-start-2">
            <Bone className="h-14 w-full rounded-2xl" />
            <Bone className="mx-auto mt-7 aspect-video w-full max-w-[1100px] rounded-2xl" />
          </div>
        </div>
      </div>
    </main>
  )
}

export function DetailPanelSkeleton({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className="animate-pulse pt-7 motion-reduce:animate-none"
    >
      <LoadingAnnouncement label={label} />
      <Bone className="h-6 w-28 rounded-lg" />
      <div aria-hidden="true" className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="w-[47%] max-w-[180px] text-center sm:w-[180px]">
            <Bone className="aspect-2/3 w-full rounded-xl" />
            <Bone className="mx-auto mt-3 h-4 w-3/4 rounded-md" />
            <Bone className="mx-auto mt-2 h-3 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
