'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, ExpandIcon } from '@/components/icons'
import { LoadingCardImage } from '@/components/loading-card-image'
import { GalleryLightbox } from '@/components/gallery-lightbox'
import { GALLERY_PREVIEW_LIMIT, getGalleryIndex, type GalleryImage, type GalleryMessages } from '@/lib/gallery'
import { getImageUrl } from '@/lib/media'

interface GalleryProps {
  images: GalleryImage[]
  title: string
  heading: string
  messages: GalleryMessages
}

const navigationButton = 'grid size-11 shrink-0 place-items-center rounded-full border border-tone/15 bg-overlay text-ink outline-none transition-colors hover:bg-tone/10 focus-visible:ring-3 focus-visible:ring-accent/50 disabled:cursor-default disabled:opacity-30'

export function Gallery({ images, title, heading, messages }: GalleryProps) {
  const id = useId()
  const track = useRef<HTMLUListElement>(null)
  const opener = useRef<HTMLButtonElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [edges, setEdges] = useState({ previous: false, next: false })
  const previews = images.slice(0, GALLERY_PREVIEW_LIMIT)
  const close = useCallback(() => setActiveIndex(null), [])
  const navigate = useCallback((direction: number) => {
    setActiveIndex((current) => getGalleryIndex((current ?? 0) + direction, images.length))
  }, [images.length])

  useEffect(() => {
    const element = track.current
    if (!element) return
    const update = () => {
      const previous = element.scrollLeft > 2
      const next = element.scrollLeft + element.clientWidth < element.scrollWidth - 2
      setEdges((current) => current.previous === previous && current.next === next ? current : { previous, next })
    }
    const observer = new ResizeObserver(update)
    observer.observe(element)
    element.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      element.removeEventListener('scroll', update)
    }
  }, [images.length])

  const scroll = (direction: number) => {
    const element = track.current
    element?.scrollBy({
      left: direction * element.clientWidth * 0.85,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  if (images.length === 0) return null

  return (
    <section className="min-w-0 pt-7" aria-labelledby={`${id}-title`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{heading}</h2>
          <span aria-label={`${messages.photos}: ${images.length}`} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium tabular-nums text-accent-strong">
            {images.length}
          </span>
        </div>
        {images.length > 1 ? (
          <div className="flex shrink-0 gap-2">
            <button type="button" aria-label={messages.scrollPrevious} aria-controls={`${id}-track`} disabled={!edges.previous} onClick={() => scroll(-1)} className={navigationButton}>
              <ArrowLeftIcon className="size-5" />
            </button>
            <button type="button" aria-label={messages.scrollNext} aria-controls={`${id}-track`} disabled={!edges.next} onClick={() => scroll(1)} className={navigationButton}>
              <ArrowRightIcon className="size-5" />
            </button>
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-5 text-subtle sm:text-sm">{messages.hint}</p>
      <ul ref={track} id={`${id}-track`} className="no-scrollbar mt-4 flex touch-auto snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain rounded-xl pb-1 sm:gap-4">
        {previews.map((image, index) => (
          <li key={image.file_path} className="w-[86%] shrink-0 snap-start snap-always sm:w-[calc(50%-0.5rem)]">
            <button
              type="button"
              aria-label={`${messages.open}: ${title} · ${messages.photo} ${index + 1}`}
              aria-haspopup="dialog"
              onClick={(event) => { opener.current = event.currentTarget; setActiveIndex(index) }}
              className="group relative block w-full overflow-hidden rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-accent"
            >
              <LoadingCardImage
                src={getImageUrl(image.file_path, 'w780') || ''}
                alt={`${title} · ${messages.photo} ${index + 1}`}
                draggable={false}
                sizes="(max-width: 639px) 85vw, (max-width: 1023px) 48vw, 440px"
                imageClassName="object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transform-none"
                containerClassName="relative aspect-video overflow-hidden rounded-xl border border-tone/10 bg-surface"
              />
              <span aria-hidden="true" className="absolute inset-0 rounded-xl border border-transparent transition-colors group-hover:border-accent/60" />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium tabular-nums text-white backdrop-blur-sm">{String(index + 1).padStart(2, '0')}</span>
              <span aria-hidden="true" className="absolute right-3 bottom-3 grid size-8 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors group-hover:bg-black/75">
                <ExpandIcon className="size-4" />
              </span>
            </button>
          </li>
        ))}
        {images.length > previews.length ? (
          <li className="w-[86%] shrink-0 snap-start snap-always sm:w-[calc(50%-0.5rem)]">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={(event) => { opener.current = event.currentTarget; setActiveIndex(previews.length) }}
              className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-accent/25 bg-gradient-to-br from-accent/15 to-surface text-accent-strong outline-none transition-colors hover:border-accent/60 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-accent"
            >
              <span className="text-3xl font-semibold tabular-nums">+{images.length - previews.length}</span>
              <span className="text-sm font-medium">{messages.viewAll}</span>
            </button>
          </li>
        ) : null}
      </ul>
      {activeIndex !== null ? (
        <GalleryLightbox
          images={images}
          index={activeIndex}
          title={title}
          messages={messages}
          returnFocus={opener}
          onClose={close}
          onNavigate={navigate}
        />
      ) : null}
    </section>
  )
}
