import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const baseProps = {
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function FilmIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M4 6.5h16v12H4z" />
      <path d="M4 10h16M8 6.5l2.5 3.5M14 6.5l2.5 3.5M3.5 3.5l16-2 1 4-16 2z" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props} fill="currentColor" stroke="none">
      <path d="M8.3 5.2a1 1 0 0 0-1.55.84v11.92a1 1 0 0 0 1.55.84l8.7-5.96a1 1 0 0 0 0-1.68z" />
    </svg>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props} fill="currentColor" stroke="none">
      <path d="m12 2.8 2.72 5.5 6.08.89-4.4 4.28 1.04 6.06L12 16.67l-5.44 2.86 1.04-6.06-4.4-4.28 6.08-.89z" />
    </svg>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M20 11a8 8 0 1 0-2.34 5.66" />
      <path d="M20 5v6h-6" />
    </svg>
  )
}
