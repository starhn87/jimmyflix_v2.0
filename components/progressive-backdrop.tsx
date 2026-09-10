'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getImageUrl, imageSkeletonPlaceholder } from '@/lib/media'

interface ProgressiveBackdropProps {
  path: string
  className?: string
  sourceSize?: 'w1280' | 'original'
}

export function ProgressiveBackdrop({
  path,
  className = '',
  sourceSize = 'original',
}: ProgressiveBackdropProps) {
  const preview = getImageUrl(path, 'w342')!
  const source = getImageUrl(path, sourceSize)!
  const [loadedSource, setLoadedSource] = useState<string | null>(null)
  const loaded = loadedSource === source

  return (
    <>
      <Image
        src={preview}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        placeholder={imageSkeletonPlaceholder}
        unoptimized
        sizes="100vw"
        className={`${className} scale-[1.015] blur-[2px] transition-opacity duration-500 motion-reduce:transition-none ${loaded ? 'opacity-0' : 'opacity-100'}`}
      />
      <Image
        src={source}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        unoptimized
        sizes="100vw"
        onLoad={() => setLoadedSource(source)}
        className={`${className} transition-opacity duration-700 motion-reduce:transition-none ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  )
}
