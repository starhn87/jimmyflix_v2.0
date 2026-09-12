'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, ExpandIcon } from '@/components/icons'
import type { GalleryImage, GalleryMessages } from '@/lib/gallery'
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
        <div role="status" className="absolute inset-0 grid animate-pulse place-items-center rounded-xl bg-white/5 text-sm text-white/65 motion-reduce:animate-none">
          {messages.loading}
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
  const touchOrigin = useRef<{ x: number; y: number } | null>(null)
  const id = useId()
  const image = images[index]

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
          className="min-h-0 flex-1 px-0 sm:px-6"
          style={{ touchAction: 'pan-y pinch-zoom' }}
          onTouchStart={(event) => {
            touchOrigin.current = event.touches.length === 1
              ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null
          }}
          onTouchMove={(event) => { if (event.touches.length !== 1) touchOrigin.current = null }}
          onTouchCancel={() => { touchOrigin.current = null }}
          onTouchEnd={(event) => {
            const origin = touchOrigin.current
            touchOrigin.current = null
            if (!origin || images.length < 2 || !event.changedTouches[0]) return
            const x = event.changedTouches[0].clientX - origin.x
            const y = event.changedTouches[0].clientY - origin.y
            if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y) * 1.5) onNavigate(x < 0 ? 1 : -1)
          }}
        >
          <OriginalImage key={image.file_path} image={image} alt={`${title} · ${messages.photo} ${index + 1}`} messages={messages} />
        </div>
        <footer className="flex shrink-0 items-center justify-center gap-6 px-4 py-4 sm:gap-8">
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
        </footer>
      </div>
    </dialog>
  )
}
