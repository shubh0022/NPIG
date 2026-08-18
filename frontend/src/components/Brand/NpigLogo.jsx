import React from 'react'

/**
 * NPIG Official SVG Brand Mark (Icon / Symbol)
 * Matches Reference Image 2: The iconic geometric 'N' with the diagonal electric-cyan/blue ribbon slash.
 */
export function NpigIcon({
  size = 36,
  className = '',
  theme = 'auto',
  animated = false,
}) {
  const isLight = theme === 'light'
  const baseColor = isLight ? '#0B132B' : '#F8FAFC'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-label="NPIG Brand Symbol"
    >
      <defs>
        {/* Dynamic Blue-to-Cyan Electric Ribbon Gradient */}
        <linearGradient id="npig-ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="45%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <filter id="npig-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Left Vertical Pillar of 'N' */}
      <path
        d="M16 18C16 13.58 19.58 10 24 10H32C36.42 10 40 13.58 40 18V82C40 86.42 36.42 90 32 90H24C19.58 90 16 86.42 16 82V18Z"
        fill={baseColor}
      />

      {/* Right Vertical Pillar of 'N' */}
      <path
        d="M60 18C60 13.58 63.58 10 68 10H76C80.42 10 84 13.58 84 18V82C84 86.42 80.42 90 76 90H68C63.58 90 60 86.42 60 82V18Z"
        fill={baseColor}
      />

      {/* Signature Diagonal Luminous Ribbon Slash across 'N' */}
      <path
        d="M20 18C20 13.58 24 10 28 10C34 10 42 18 48 26L76 68C82 78 84 86.42 80 90C76 90 68 84 62 76L32 30C26 22 20 19 20 18Z"
        fill="url(#npig-ribbon-grad)"
        filter="url(#npig-glow)"
        className={animated ? 'animate-pulse' : ''}
      />
    </svg>
  )
}

/**
 * NPIG Master Vector Brand Wordmark
 * Reproduces Reference Image 2: "NPIG" with custom geometric letterforms & diagonal blue ribbon on 'N'.
 * 
 * @param {Object} props
 * @param {'horizontal' | 'mark' | 'stacked' | 'dashboard' | 'compact'} [props.variant='horizontal']
 * @param {'dark' | 'light' | 'auto' | 'monochrome'} [props.theme='auto']
 * @param {number|string} [props.height=32]
 * @param {boolean} [props.showTagline=false]
 * @param {string} [props.className='']
 */
export default function NpigLogo({
  variant = 'horizontal',
  theme = 'auto',
  height = 32,
  showTagline = false,
  collapsed = false,
  className = '',
}) {
  const isLight = theme === 'light'
  const textColor = isLight ? '#0B132B' : '#F8FAFC'
  const subTextColor = isLight ? '#64748B' : '#94A3B8'

  // If collapsed in dashboard sidebar, render only the icon mark
  if (collapsed || variant === 'mark') {
    return <NpigIcon size={height} theme={theme} className={className} />
  }

  // Calculate proportional width based on viewBox (420 x 100)
  const calcWidth = typeof height === 'number' ? height * 4.2 : 'auto'

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <svg
        height={height}
        width={calcWidth}
        viewBox="0 0 420 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="NPIG - National Predictive Intelligence Grid"
      >
        <defs>
          {/* Luminous Diagonal Ribbon Gradient matching Reference Image 2 */}
          <linearGradient id="npig-slash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="35%" stopColor="#0EA5E9" />
            <stop offset="70%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Subtle glow filter for the dynamic ribbon */}
          <filter id="npig-slash-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ══════════════════════════════════════════════════════════
            LETTER 'N' — Geometric with Cyan/Blue Diagonal Slash
            ══════════════════════════════════════════════════════════ */}
        <g id="letter-N">
          {/* N Left Stem */}
          <path
            d="M8 20C8 14.48 12.48 10 18 10H28C33.52 10 38 14.48 38 20V80C38 85.52 33.52 90 28 90H18C12.48 90 8 85.52 8 80V20Z"
            fill={textColor}
          />
          {/* N Right Stem */}
          <path
            d="M62 20C62 14.48 66.48 10 72 10H82C87.52 10 92 14.48 92 20V80C92 85.52 87.52 90 82 90H72C66.48 90 62 85.52 62 80V20Z"
            fill={textColor}
          />
          {/* N Dynamic Curved Diagonal Slash */}
          <path
            d="M14 18C14 12.5 19 10 24 10C29 10 38 18 45 27L76 68C83 78 86 86 82 90C78 90 70 85 64 76L30 30C23 20 16 19 14 18Z"
            fill="url(#npig-slash-gradient)"
            filter="url(#npig-slash-glow)"
          />
        </g>

        {/* ══════════════════════════════════════════════════════════
            LETTER 'P' — Geometric Bold Sans with Rounded Bowl
            ══════════════════════════════════════════════════════════ */}
        <g id="letter-P">
          {/* P Outer Body */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M112 20C112 14.48 116.48 10 122 10H165C187.09 10 205 27.91 205 50C205 72.09 187.09 90 165 90H142V80C142 80 142 66 142 66H165C173.84 66 181 58.84 181 50C181 41.16 173.84 34 165 34H136V80C136 85.52 131.52 90 126 90H122C116.48 90 112 85.52 112 80V20Z"
            fill={textColor}
          />
        </g>

        {/* ══════════════════════════════════════════════════════════
            LETTER 'I' — Geometric Pillar
            ══════════════════════════════════════════════════════════ */}
        <g id="letter-I">
          <path
            d="M225 20C225 14.48 229.48 10 235 10H247C252.52 10 257 14.48 257 20V80C257 85.52 252.52 90 247 90H235C229.48 90 225 85.52 225 80V20Z"
            fill={textColor}
          />
        </g>

        {/* ══════════════════════════════════════════════════════════
            LETTER 'G' — Wide Geometric with Inward Bar
            ══════════════════════════════════════════════════════════ */}
        <g id="letter-G">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M345 10C372.61 10 395 32.39 395 60C395 76.57 381.57 90 365 90H325C297.39 90 275 67.61 275 40C275 23.43 288.43 10 305 10H345ZM345 34H312C304.82 34 299 39.82 299 47C299 60.81 310.19 72 324 72H358C364.63 72 370 66.63 370 60V54H338C332.48 54 328 49.52 328 44C328 38.48 332.48 34 338 34H375C380.52 34 385 38.48 385 44V60C385 71.05 376.05 80 365 80L345 34Z"
            fill={textColor}
          />
        </g>
      </svg>

      {/* Optional Sovereign Descriptor Tagline */}
      {showTagline && (
        <span
          className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase mt-1 pl-1"
          style={{ color: subTextColor }}
        >
          National Predictive Intelligence Grid
        </span>
      )}
    </div>
  )
}
