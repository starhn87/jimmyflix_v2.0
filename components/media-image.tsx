'use client'

import Image, { type ImageProps } from 'next/image'
import { tmdbImageLoaders, type TmdbImageKind } from '@/lib/tmdb-image-loader'

type MediaImageProps = ImageProps & {
  tmdbKind?: TmdbImageKind
}

export function MediaImage({ src, alt, loader, tmdbKind, unoptimized, onError, style, ...props }: MediaImageProps) {
  const stringSource = typeof src === 'string' ? src : null
  const isTmdbSource = stringSource?.startsWith('https://image.tmdb.org/t/p/') ?? false
  const useTmdbLoader = Boolean(isTmdbSource && tmdbKind && !unoptimized)
  const responsiveLoader = useTmdbLoader && tmdbKind ? tmdbImageLoaders[tmdbKind] : loader
  const isDirectSource = Boolean(stringSource && (
    stringSource.startsWith('/images/') ||
    stringSource.startsWith('https://i.ytimg.com/') ||
    (isTmdbSource && !useTmdbLoader)
  ))

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      // TMDB's loader builds a responsive srcset from its own CDN sizes, so it
      // does not consume a Vercel Image Transformation. Other stable media URLs
      // remain direct to avoid optimizer quota failures.
      loader={responsiveLoader}
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
