import type { MetadataRoute } from 'next'

export default function AppleIcon(): MetadataRoute.Icon {
  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bg" cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.22" />
          <stop offset="45%" stopColor="#111827" stopOpacity="1" />
          <stop offset="100%" stopColor="#05070d" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="55%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="512" height="512" rx="120" fill="url(#bg)" />

      <path
        d="M260 86c13 56-15 90-43 121-28 33-46 59-46 97 0 72 57 129 126 129 70 0 133-58 133-134 0-57-32-102-70-138-23-22-44-47-57-85-10 18-14 42-19 68-6 30-12 61-24 83-6-25-7-52 0-141Z"
        fill="url(#flame)"
      />
      <path
        d="M272 224c4 19-4 34-13 44-10 11-16 23-16 39 0 26 21 47 45 47 25 0 47-22 47-49 0-20-12-36-24-48-9-9-17-19-22-33-4 6-6 14-8 22-3 12-6 24-9 31Z"
        fill="rgba(255, 237, 213, 0.9)"
      />
    </svg>
  )
}

