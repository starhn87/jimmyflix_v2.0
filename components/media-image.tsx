'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

export function MediaImage({ src, alt, unoptimized, onError, ...props }: ImageProps) {
  const [failedSource, setFailedSource] = useState<ImageProps['src'] | null>(null)
  // Local fallback artwork is only a few KB and needs no transformation.
  const useSource = unoptimized || (typeof src === 'string' && src.startsWith('/images/')) || failedSource === src

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={useSource}
      onError={(event) => {
        // An optimizer outage or quota limit should not hide a working CDN image.
        // Retry the source once, then let the caller show its usual error state.
        if (!useSource && typeof src === 'string' && /^https:\/\/(image\.tmdb\.org|i\.ytimg\.com)\//.test(src)) {
          setFailedSource(src)
          return
        }
        onError?.(event)
      }}
    />
  )
}
