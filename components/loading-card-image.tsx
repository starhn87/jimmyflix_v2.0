'use client'

import Image from 'next/image'
import { useState } from 'react'
import { imageSkeletonPlaceholder } from '@/lib/media'

interface LoadingCardImageProps {
  src: string
  alt: string
  sizes: string
  imageClassName: string
  containerClassName: string
  draggable?: boolean
}

export function LoadingCardImage({
  src,
  alt,
  sizes,
  imageClassName,
  containerClassName,
  draggable,
}: LoadingCardImageProps) {
  const [settledSrc, setSettledSrc] = useState<string | null>(null)
  const loaded = settledSrc === src

  return (
    <div
      aria-busy={!loaded}
      className={containerClassName}
    >
      {!loaded ? (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-pulse bg-tone/7 motion-reduce:animate-none">
          <span
            className="absolute inset-0 motion-reduce:hidden"
            style={{ backgroundImage: `url("${imageSkeletonPlaceholder}")`, backgroundSize: '100% 100%' }}
          />
        </span>
      ) : null}
      <Image
        key={src}
        src={src}
        alt={alt}
        draggable={draggable}
        fill
        quality={85}
        sizes={sizes}
        onLoad={() => setSettledSrc(src)}
        onError={() => setSettledSrc(src)}
        className={`${imageClassName} transition-opacity duration-300 motion-reduce:transition-none ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
