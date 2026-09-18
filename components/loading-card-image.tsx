'use client'

import { MediaImage } from '@/components/media-image'
import { useState } from 'react'
import { imageSkeletonPlaceholder } from '@/lib/media'

interface LoadingCardImageProps {
  src: string
  alt: string
  sizes: string
  imageClassName: string
  containerClassName: string
  draggable?: boolean
  unoptimized?: boolean
}

export function LoadingCardImage({
  src,
  alt,
  sizes,
  imageClassName,
  containerClassName,
  draggable,
  unoptimized,
}: LoadingCardImageProps) {
  const [settled, setSettled] = useState<{ src: string; status: 'loaded' | 'error' } | null>(null)
  const state = settled?.src === src ? settled.status : 'loading'

  return (
    <div
      aria-busy={state === 'loading'}
      data-image-state={state}
      className={containerClassName}
    >
      {state === 'loading' ? (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-pulse bg-tone/7 motion-reduce:animate-none">
          <span
            className="absolute inset-0 motion-reduce:hidden"
            style={{ backgroundImage: `url("${imageSkeletonPlaceholder}")`, backgroundSize: '100% 100%' }}
          />
        </span>
      ) : null}
      {state === 'error' ? (
        <span role={alt ? 'img' : undefined} aria-label={alt || undefined} className="absolute inset-0 grid place-items-center bg-surface text-faint">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-1/3 max-w-12 opacity-60">
            <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" />
            <path d="m3 17 5-5 4 4 3-3 6 6" />
          </svg>
        </span>
      ) : <MediaImage
        key={src}
        src={src}
        alt={alt}
        draggable={draggable}
        unoptimized={unoptimized}
        fill
        quality={85}
        sizes={sizes}
        onLoad={() => setSettled({ src, status: 'loaded' })}
        onError={() => setSettled({ src, status: 'error' })}
        className={`${imageClassName} transition-opacity duration-300 motion-reduce:transition-none ${state === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
      />}
    </div>
  )
}
