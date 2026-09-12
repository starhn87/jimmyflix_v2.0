'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, ExpandIcon } from '@/components/icons'
import { getGallerySwipeDirection, type GalleryImage, type GalleryMessages } from '@/lib/gallery'
import { getImageUrl } from '@/lib/media'

interface GalleryLightboxProps {
  images: GalleryImage[]
  index: number
  title: string
  messages: GalleryMessages
  returnFocus: RefObject<HTMLButtonElement | null>
  onClose: () => void
  onNavigate: (direction: number) => void
}

const control = 'grid size-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/8 text-white outline-none transition-colors hover:bg-white/18 focus-visible:ring-3 focus-visible:ring-violet-300'

function OriginalImage({ image, alt, messages }: { image: GalleryImage; alt: string; messages: GalleryMessages }) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <div className="relative h-full w-full" aria-busy={state === 'loading'}>
      {state === 'loading' ? (
        <div role="status" className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden rounded-xl">
          <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/15 via-violet-300/10 to-white/5 motion-reduce:animate-none" />
          <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#0b0912]/80 px-6 py-5 text-sm text-white/85">
            <span aria-hidden="true" className="size-10 animate-spin rounded-full border-3 border-white/15 border-t-violet-300 motion-reduce:animate-none" />
            <span>{messages.loading}</span>
          </div>
        </div>
      ) : null}
      {state === 'error' ? (
        <div role="status" className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm leading-6 text-white/75">{messages.error}</div>
      ) : (
        <Image
          src={getImageUrl(image.file_path, 'original') || ''}
          alt={alt}
          fill
          unoptimized
          loading="eager"
          draggable={false}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={`object-contain transition-opacity duration-200 motion-reduce:transition-none ${state === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}

export function GalleryLightbox({ images, index, title, messages, returnFocus, onClose, onNavigate }: GalleryLightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const swipeContent = useRef<HTMLDivElement>(null)
  const swipe = useRef<{ pointerId: number; x: number; y: number; axis: 'pending' | 'horizontal' | 'vertical' } | null>(null)
  const id = useId()
  const image = images[index]

  const resetSwipe = () => {
    swipe.current = null
    if (swipeContent.current) {
      swipeContent.current.removeAttribute('data-dragging')
      swipeContent.current.style.transform = ''
    }
  }

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    const trigger = returnFocus.current
    const root = document.documentElement
    const overflow = root.style.overflow
    const gutter = root.style.scrollbarGutter
    root.style.scrollbarGutter = 'stable'
    root.style.overflow = 'hidden'
    element.showModal()
    closeButton.current?.focus({ preventScroll: true })

    return () => {
      element.close()
      root.style.overflow = overflow
      root.style.scrollbarGutter = gutter
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [returnFocus])

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${id}-title`}
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close() }}
      onKeyDown={(event) => {
        if (images.length < 2) return
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          event.stopPropagation()
          onNavigate(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}
      className="gallery-lightbox fixed inset-0 m-auto h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 text-white outline-none backdrop:bg-black/85 sm:h-[min(90dvh,1100px)] sm:w-[calc(100vw-3rem)] sm:max-w-[1800px] sm:rounded-2xl sm:border sm:border-white/15 sm:shadow-2xl"
    >
      <div className="flex h-full flex-col bg-[#0b0912] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h2 id={`${id}-title`} className="truncate text-sm font-semibold sm:text-base">{title}</h2>
            <p className="mt-1 text-xs tabular-nums text-white/55">{image.width} × {image.height}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={getImageUrl(image.file_path, 'original') || ''}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs font-medium text-white/75 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-violet-300"
            >
              <ExpandIcon className="size-4" />{messages.original}
            </a>
            <button ref={closeButton} type="button" aria-label={messages.close} onClick={() => dialog.current?.close()} className={control}>
              <CloseIcon className="size-5" />
            </button>
          </div>
        </header>
        <div
          className="min-h-0 flex-1 overflow-hidden px-0 sm:px-6"
          style={{ touchAction: 'pan-y pinch-zoom' }}
          onPointerDown={(event) => {
            if (event.pointerType === 'mouse' || images.length < 2) return
            if (!event.isPrimary || (window.visualViewport?.scale ?? 1) > 1) {
              resetSwipe()
              return
            }
            swipe.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, axis: 'pending' }
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            const origin = swipe.current
            if (!origin || origin.pointerId !== event.pointerId) return
            const x = event.clientX - origin.x
            const y = event.clientY - origin.y
            if (origin.axis === 'pending' && Math.max(Math.abs(x), Math.abs(y)) > 8) {
              origin.axis = Math.abs(x) > Math.abs(y) * 1.25 ? 'horizontal' : 'vertical'
            }
            if (origin.axis === 'horizontal' && swipeContent.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              swipeContent.current.dataset.dragging = ''
              swipeContent.current.style.transform = `translateX(${Math.max(-100, Math.min(100, x * 0.35))}px)`
            }
          }}
          onPointerCancel={resetSwipe}
          onLostPointerCapture={resetSwipe}
          onPointerUp={(event) => {
            const origin = swipe.current
            resetSwipe()
            if (!origin || origin.pointerId !== event.pointerId || origin.axis === 'vertical') return
            const direction = getGallerySwipeDirection(event.clientX - origin.x, event.clientY - origin.y, event.currentTarget.clientWidth)
            if (direction) onNavigate(direction)
          }}
        >
          <div ref={swipeContent} className="h-full w-full transition-transform duration-200 ease-out data-dragging:transition-none motion-reduce:transition-none">
            <OriginalImage key={image.file_path} image={image} alt={`${title} · ${messages.photo} ${index + 1}`} messages={messages} />
          </div>
        </div>
        <footer className="shrink-0 px-4 py-4">
          {images.length > 1 ? <p className="mb-3 text-center text-xs text-white/55 sm:hidden">{messages.swipeHint}</p> : null}
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            {images.length > 1 ? (
              <button type="button" aria-label={messages.previous} onClick={() => onNavigate(-1)} className={control}>
                <ArrowLeftIcon className="size-6" />
              </button>
            ) : null}
            <p aria-live="polite" aria-atomic="true" className="min-w-20 text-center text-sm tabular-nums text-white/80">
              <span className="sr-only">{messages.photo} </span>{index + 1} <span className="px-1 text-white/35">/</span> {images.length}
            </p>
            {images.length > 1 ? (
              <button type="button" aria-label={messages.next} onClick={() => onNavigate(1)} className={control}>
                <ArrowRightIcon className="size-6" />
              </button>
            ) : null}
          </div>
        </footer>
      </div>
    </dialog>
  )
}
