import {
  CATALOG_RAIL_STACK_CLASS_NAME,
  MEDIA_RAIL_HEADER_CLASS_NAME,
  MEDIA_RAIL_ITEM_CLASS_NAME,
  MEDIA_RAIL_SKELETON_LIST_CLASS_NAME,
} from '@/components/media-rail-styles'

const cardPlaceholders = Array.from({ length: 8 })
const linePlaceholders = Array.from({ length: 3 })

function Bone({ className }: { className: string }) {
  return <div className={`bg-tone/7 ${className}`} />
}

function LoadingAnnouncement({ label }: { label: string }) {
  return <span className="sr-only">{label}</span>
}

function MediaRailSkeletonVisual({ withToolbar = false, withMediaTypeFilter = false }: { withToolbar?: boolean; withMediaTypeFilter?: boolean } = {}) {
  return (
    <section aria-hidden="true" className={withToolbar ? undefined : 'render-later'}>
      <div className={MEDIA_RAIL_HEADER_CLASS_NAME}>
        <Bone className="h-7 w-40 rounded-lg sm:h-8 sm:w-52" />
        <Bone className="mt-2 h-4 w-56 max-w-[70vw] rounded-md" />
        {withToolbar ? (
          <div className="mt-4">
            {withMediaTypeFilter ? <Bone className="mb-3 h-[50px] w-[202px] rounded-full" /> : null}
            <div className="flex gap-2 overflow-hidden pb-1">
              {['w-24', 'w-28', 'w-24', 'w-28', 'w-24'].map((width, index) => (
                <Bone key={index} className={`h-10 shrink-0 rounded-full ${width}`} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <ul className={MEDIA_RAIL_SKELETON_LIST_CLASS_NAME}>
        {cardPlaceholders.map((_, index) => (
          <li
            key={index}
            className={MEDIA_RAIL_ITEM_CLASS_NAME}
          >
            <Bone className="aspect-2/3 w-full rounded-xl" />
            <div className="mt-3 min-h-15">
              <Bone className="h-4 w-4/5 rounded-md" />
              <Bone className="mt-1 h-4 w-2/5 rounded-md" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function HeroSkeletonVisual() {
  return (
    <section aria-hidden="true" className="relative min-h-[520px] overflow-hidden sm:min-h-[600px] lg:min-h-[680px]">
      <div className="absolute inset-0 hero-vignette" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-surface/65 to-surface/30" />
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
  )
}

export function HeroSkeleton({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className="animate-pulse motion-reduce:animate-none"
    >
      <LoadingAnnouncement label={label} />
      <HeroSkeletonVisual />
    </div>
  )
}

export function MediaSectionSkeleton({
  label,
  withToolbar = false,
  withMediaTypeFilter = false,
}: {
  label: string
  withToolbar?: boolean
  withMediaTypeFilter?: boolean
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className="animate-pulse motion-reduce:animate-none"
    >
      <LoadingAnnouncement label={label} />
      <MediaRailSkeletonVisual withToolbar={withToolbar} withMediaTypeFilter={withMediaTypeFilter} />
    </div>
  )
}

export function CatalogSkeleton({ label }: { label: string }) {
  return (
    <main aria-busy="true" aria-live="polite" aria-label={label}>
      <LoadingAnnouncement label={label} />
      <div className="animate-pulse motion-reduce:animate-none">
        <HeroSkeletonVisual />
        <div className={CATALOG_RAIL_STACK_CLASS_NAME}>
          {Array.from({ length: 8 }, (_, index) => (
            <MediaRailSkeletonVisual key={index} withToolbar={index === 1} />
          ))}
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
      {Array.from({ length: count }, (_, index) => <MediaRailSkeletonVisual key={index} />)}
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
            <div className="mt-3 space-y-1.5">
              <Bone className="h-4 w-4/5 rounded-md" />
              <Bone className="h-4 w-3/5 rounded-md" />
            </div>
            <Bone className="mt-1 h-4 w-2/5 rounded-md" />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function SearchResultsSkeleton({ label = 'Loading search results' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className="mx-auto max-w-[1600px] animate-pulse px-4 motion-reduce:animate-none sm:px-6 lg:px-10"
    >
      <LoadingAnnouncement label={label} />
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
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-canvas"
    >
      <LoadingAnnouncement label={label} />
      <div className="animate-pulse motion-reduce:animate-none">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 hidden aspect-video bg-gradient-to-b from-surface/80 to-canvas md:block" />
        <div aria-hidden="true" className="relative mx-auto grid max-w-[1480px] grid-cols-1 items-start gap-y-0 px-4 pt-0 pb-8 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-x-4 sm:gap-y-6 sm:px-6 sm:py-8 md:py-12 lg:grid-cols-[minmax(340px,min(40vw,480px))_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-8 lg:px-10">
          <Bone className="-mx-4 aspect-2/3 w-[calc(100%+2rem)] rounded-none sm:mx-0 sm:w-full sm:rounded-2xl lg:row-span-3" />

          <header className="min-w-0 pt-6 sm:pt-1 lg:pt-4">
            <Bone className="h-8 w-4/5 max-w-xl rounded-lg sm:h-11 lg:h-16" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Bone className="h-8 w-24 rounded-full" />
              <Bone className="h-8 w-16 rounded-full" />
              <Bone className="h-8 w-20 rounded-full" />
              <Bone className="h-8 w-28 rounded-full" />
            </div>
          </header>

          <div className="mt-6 max-w-[76ch] space-y-3 sm:col-span-2 sm:mt-0 lg:col-span-1 lg:col-start-2">
            {linePlaceholders.map((_, index) => (
              <Bone key={index} className={`h-4 rounded-md ${index === 2 ? 'w-3/4' : 'w-full'}`} />
            ))}
          </div>

          <div className="mt-6 min-w-0 pb-16 sm:col-span-2 sm:mt-0 lg:col-span-1 lg:col-start-2">
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
      <div aria-hidden="true" className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-5 lg:justify-start">
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

export function PersonSkeleton({ label }: { label: string }) {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className="min-h-[calc(100vh-4rem)] bg-canvas pb-20"
    >
      <LoadingAnnouncement label={label} />
      <div className="animate-pulse motion-reduce:animate-none">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-4 py-8 sm:px-6 md:grid-cols-[minmax(240px,340px)_minmax(0,1fr)] md:gap-12 md:py-14 lg:px-10">
          <Bone className="mx-auto aspect-2/3 w-full max-w-[340px] rounded-2xl md:mx-0" />
          <div className="md:pt-3">
            <Bone className="h-11 w-32 rounded-full" />
            <Bone className="mt-7 h-12 w-4/5 max-w-xl rounded-xl sm:h-16" />
            <Bone className="mt-4 h-8 w-24 rounded-full" />
            <Bone className="mt-9 h-7 w-32 rounded-lg" />
            <div className="mt-4 max-w-3xl space-y-3">
              <Bone className="h-4 w-full rounded-md" />
              <Bone className="h-4 w-full rounded-md" />
              <Bone className="h-4 w-3/4 rounded-md" />
            </div>
          </div>
        </div>
        <MediaRailSkeletonVisual />
      </div>
    </main>
  )
}
