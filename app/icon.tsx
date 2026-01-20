import type { MetadataRoute } from 'next'

export default function Icon(): MetadataRoute.Icon {
  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1ea3a3" />
          <stop offset="55%" stopColor="#2f6fb0" />
          <stop offset="100%" stopColor="#3b4aa8" />
        </linearGradient>
        <linearGradient id="txt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#baf7d8" />
          <stop offset="45%" stopColor="#cde9ff" />
          <stop offset="100%" stopColor="#b8c9ff" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="512" height="512" rx="0" fill="url(#bg)" />

      <g fill="url(#txt)">
        <text
          x="256"
          y="230"
          textAnchor="middle"
          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
          fontWeight="800"
          fontSize="104"
          letterSpacing="2"
        >
          HABIT
        </text>
        <text
          x="256"
          y="355"
          textAnchor="middle"
          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
          fontWeight="800"
          fontSize="104"
          letterSpacing="2"
        >
          STUDIO
        </text>
      </g>
    </svg>
  )
}

