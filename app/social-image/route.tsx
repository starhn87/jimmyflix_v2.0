import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export function GET() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', padding: 80, flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(120deg, #0b0912, #281b48)', color: '#f7f3ff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <svg width="120" height="120" viewBox="0 0 64 64">
            <defs><linearGradient id="ticket" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a78bfa" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs>
            <path transform="rotate(-12 32 32)" fill="url(#ticket)" fillRule="evenodd" d="M8 12H56Q61 12 61 17V25C53 25 53 39 61 39V47Q61 52 56 52H8Q3 52 3 47V39C11 39 11 25 3 25V17Q3 12 8 12ZM34 19H43V35C43 42 39 46 32 46C24 46 20 42 20 35H29C29 38 30 39 32 39C33.5 39 34 38 34 35Z" />
          </svg>
          <span style={{ fontSize: 76, fontWeight: 700, letterSpacing: -4 }}>Jimmyflix</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2 }}>Find your next great story.</span>
          <span style={{ fontSize: 28, color: '#c4b5fd' }}>Movies · TV · Collections · Cast</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
