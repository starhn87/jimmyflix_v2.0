import { ImageResponse } from 'next/og'
import { BRAND_SHARE_IMAGE } from '@/lib/seo'

export const dynamic = 'force-static'

export function GET() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%', overflow: 'hidden', padding: 64, background: 'linear-gradient(115deg, #0b0912 38%, #2e1c46 100%)', color: '#fbf9ff' }}>
        <div style={{ display: 'flex', position: 'absolute', top: 24, left: 24, width: 1152, height: 582, border: '1px solid #a78bfa30', borderRadius: 28 }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 710, height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#c4b5fd', fontSize: 18, letterSpacing: 4 }}>
            <span style={{ width: 28, height: 3, background: '#a78bfa' }} />
            YOUR NEXT STORY STARTS HERE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 104, fontWeight: 700, letterSpacing: -6, lineHeight: 1.1 }}>Jimmyflix</span>
            <span style={{ marginTop: 26, fontSize: 42, lineHeight: 1.3, color: '#ddd6fe' }}>Find your next great story.</span>
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {['MOVIES', 'SERIES', 'DISCOVERY'].map((label) => (
                <span key={label} style={{ display: 'flex', padding: '10px 18px', borderRadius: 24, border: '1px solid #a78bfa40', background: '#a78bfa0d', color: '#c4b5fd', fontSize: 16, letterSpacing: 2 }}>{label}</span>
              ))}
            </div>
          </div>
          <span style={{ color: '#9d91b7', fontSize: 20 }}>jimmyflix.vercel.app</span>
        </div>
        <div style={{ display: 'flex', position: 'absolute', right: 48, top: 136, width: 350, height: 350, alignItems: 'center', justifyContent: 'center' }}>
          <svg width="350" height="350" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="ticket" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c4b5fd" /><stop offset="0.48" stopColor="#a78bfa" /><stop offset="1" stopColor="#ec4899" /></linearGradient>
            </defs>
            <path transform="rotate(-12 32 32)" fill="url(#ticket)" fillRule="evenodd" d="M8 12H56Q61 12 61 17V25C53 25 53 39 61 39V47Q61 52 56 52H8Q3 52 3 47V39C11 39 11 25 3 25V17Q3 12 8 12ZM34 19H43V35C43 42 39 46 32 46C24 46 20 42 20 35H29C29 38 30 39 32 39C33.5 39 34 38 34 35Z" />
          </svg>
        </div>
      </div>
    ),
    { width: BRAND_SHARE_IMAGE.width, height: BRAND_SHARE_IMAGE.height },
  )
}
