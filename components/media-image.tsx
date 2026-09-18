'use client'

import Image, { type ImageProps } from 'next/image'

export function MediaImage({ src, alt, unoptimized, onError, style, ...props }: ImageProps) {
  const isDirectSource = typeof src === 'string' && (
    src.startsWith('/images/') ||
    /^https:\/\/(image\.tmdb\.org|i\.ytimg\.com)\//.test(src)
  )

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      // These CDNs already provide stable, long-lived media URLs. Going direct
      // also prevents an exhausted optimizer quota from flashing a broken URL
      // before client-side error handling is available.
      unoptimized={unoptimized || isDirectSource}
      style={{ ...style, color: 'transparent' }}
      onError={(event) => {
        // Keep a missing source from painting the browser's broken-image UI.
        event.currentTarget.style.visibility = 'hidden'
        onError?.(event)
      }}
    />
  )
}
