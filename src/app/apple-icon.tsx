import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
          borderRadius: '22%',
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="glass-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.95}/>
              <stop offset="50%" stopColor="#e8f4fc" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#d0e8f5" stopOpacity={0.6}/>
            </linearGradient>

            <linearGradient id="glass-right" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b8d4e8" stopOpacity={0.7}/>
              <stop offset="100%" stopColor="#8bb8d4" stopOpacity={0.5}/>
            </linearGradient>

            <linearGradient id="inner-reflect" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0}/>
            </linearGradient>

            {/* Rainbow sheen gradient */}
            <linearGradient id="rainbow-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.35}/>
              <stop offset="15%" stopColor="#FFB347" stopOpacity={0.35}/>
              <stop offset="30%" stopColor="#FFE66D" stopOpacity={0.35}/>
              <stop offset="45%" stopColor="#7ED321" stopOpacity={0.35}/>
              <stop offset="60%" stopColor="#4ECDC4" stopOpacity={0.35}/>
              <stop offset="75%" stopColor="#45B7D1" stopOpacity={0.35}/>
              <stop offset="90%" stopColor="#9B6BFF" stopOpacity={0.35}/>
              <stop offset="100%" stopColor="#9B6BFF" stopOpacity={0}/>
            </linearGradient>

            {/* Secondary rainbow */}
            <linearGradient id="rainbow-sheen-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9B6BFF" stopOpacity={0.25}/>
              <stop offset="20%" stopColor="#45B7D1" stopOpacity={0.25}/>
              <stop offset="40%" stopColor="#4ECDC4" stopOpacity={0.25}/>
              <stop offset="60%" stopColor="#FFE66D" stopOpacity={0.25}/>
              <stop offset="80%" stopColor="#FFB347" stopOpacity={0.25}/>
              <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0.2}/>
            </linearGradient>

            <filter id="sheen-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur"/>
            </filter>

            <clipPath id="prism-clip">
              <polygon points="4,25 14,5 21,25"/>
            </clipPath>
          </defs>

          {/* 3D Prism base */}
          <polygon points="14,5 24,22 21,25 14,9" fill="url(#glass-right)" stroke="#a0c4d8" strokeWidth="0.5"/>
          <polygon points="4,25 14,5 21,25" fill="url(#glass-front)" stroke="#b0d0e0" strokeWidth="0.5"/>
          <polygon points="4,25 21,25 24,22 7,22" fill="url(#glass-right)" stroke="#a0c4d8" strokeWidth="0.5" opacity="0.6"/>

          {/* Rainbow sheen inside prism */}
          <g clipPath="url(#prism-clip)">
            <polygon points="4,25 14,5 21,25" fill="url(#rainbow-sheen)" filter="url(#sheen-blur)"/>
            <polygon points="4,25 14,5 21,25" fill="url(#rainbow-sheen-2)" filter="url(#sheen-blur)"/>
          </g>

          {/* Inner reflection */}
          <polygon points="6,23 14,8 19,23" fill="url(#inner-reflect)"/>

          {/* Edge highlight */}
          <line x1="14" y1="5" x2="4" y2="25" stroke="#ffffff" strokeWidth="1.2" opacity="0.7"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
