'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PlayIcon } from '@/components/icons'
import { imageSkeletonPlaceholder } from '@/lib/media'

interface VideoEmbedProps {
  videoKey: string
  frameTitle: string
  playLabel: string
}

export function VideoEmbed({ videoKey, frameTitle, playLabel }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="mx-auto mt-7 aspect-video w-full max-w-[1100px] overflow-hidden rounded-2xl border border-tone/10 bg-black shadow-media">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
          title={frameTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="block size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={playLabel}
          className="group relative block size-full overflow-hidden text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent/70"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoKey}/maxresdefault.jpg`}
            alt=""
            fill
            placeholder={imageSkeletonPlaceholder}
            quality={85}
            sizes="(max-width: 768px) 100vw, 1100px"
            className="object-cover object-center transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/15" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="relative grid size-16 place-items-center rounded-full border border-white/55 bg-black/48 text-white shadow-[0_14px_45px_rgba(0,0,0,0.42)] backdrop-blur-md transition duration-300 ease-out before:absolute before:-inset-2 before:rounded-full before:border before:border-white/15 before:opacity-0 before:transition before:duration-300 group-hover:scale-105 group-hover:border-white/80 group-hover:bg-white group-hover:text-[#160d24] group-hover:shadow-[0_16px_50px_rgba(0,0,0,0.5)] group-hover:before:opacity-100 group-active:scale-95 sm:size-[4.5rem]">
              <PlayIcon className="ml-0.5 size-6 sm:size-7" />
            </span>
          </span>
          <span className="absolute inset-x-5 bottom-5 line-clamp-2 text-sm font-semibold text-white drop-shadow-lg sm:text-base">
            {playLabel}
          </span>
        </button>
      )}
    </div>
  )
}
