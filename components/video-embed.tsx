'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PlayIcon } from '@/components/icons'

interface VideoEmbedProps {
  videoKey: string
  title: string
}

export function VideoEmbed({ videoKey, title }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="mx-auto mt-7 aspect-video w-full max-w-[1100px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
          title={`${title} official trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="block size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title} official trailer`}
          className="group relative block size-full overflow-hidden text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-cyan-300/70"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoKey}/maxresdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1100px"
            className="object-cover object-center transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/15" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full bg-cyan-300 text-slate-950 shadow-2xl shadow-black/50 transition group-hover:scale-105 sm:size-20">
              <PlayIcon className="ml-1 size-7 sm:size-9" />
            </span>
          </span>
          <span className="absolute inset-x-5 bottom-5 line-clamp-2 text-sm font-semibold text-white drop-shadow-lg sm:text-base">
            Play {title} official trailer
          </span>
        </button>
      )}
    </div>
  )
}
