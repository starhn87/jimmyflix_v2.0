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
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      aria-busy={!loaded}
      className={`${containerClassName} ${loaded ? '' : 'animate-pulse motion-reduce:animate-none'}`}
    >
      <Image
        src={src}
        alt={alt}
        draggable={draggable}
        fill
        placeholder={imageSkeletonPlaceholder}
        quality={85}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${imageClassName} transition-opacity duration-300 motion-reduce:transition-none ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
