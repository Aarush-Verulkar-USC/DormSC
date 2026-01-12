'use client';

interface CleanProjectIllustrationProps {
  className?: string;
}

export default function CleanProjectIllustration({ className = '' }: CleanProjectIllustrationProps) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        className="w-full h-full max-w-lg"
        style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.1))' }}
      >
        <defs>
          <linearGradient id="houseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.9)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.7)' }} />
          </linearGradient>
          <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.8)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.6)' }} />
          </linearGradient>
          <linearGradient id="connectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.7)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.5)' }} />
          </linearGradient>
          <filter id="glassmorphism">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0"/>
          </filter>
        </defs>

        {/* Main house icon */}
        <g transform="translate(120, 60)">
          {/* House base */}
          <rect x="0" y="30" width="100" height="80" fill="url(#houseGradient)" rx="6" filter="url(#glassmorphism)" />
          {/* House roof */}
          <polygon points="0,30 50,0 100,30" fill="rgba(255,255,255,0.8)" filter="url(#glassmorphism)" />
          {/* Door */}
          <rect x="40" y="70" width="20" height="40" fill="rgba(255,255,255,0.9)" rx="3" />
          <circle cx="55" cy="90" r="2" fill="rgba(0,0,0,0.3)" />
          {/* Windows */}
          <rect x="15" y="50" width="20" height="20" fill="rgba(255,255,255,0.9)" rx="3" />
          <rect x="65" y="50" width="20" height="20" fill="rgba(255,255,255,0.9)" rx="3" />
          {/* Window crosses */}
          <line x1="25" y1="50" x2="25" y2="70" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
          <line x1="15" y1="60" x2="35" y2="60" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
          <line x1="75" y1="50" x2="75" y2="70" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
          <line x1="65" y1="60" x2="85" y2="60" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        </g>

        {/* Search magnifying glass */}
        <g transform="translate(60, 200)">
          <circle cx="20" cy="20" r="18" fill="none" stroke="url(#searchGradient)" strokeWidth="4" filter="url(#glassmorphism)" />
          <line x1="34" y1="34" x2="50" y2="50" stroke="url(#searchGradient)" strokeWidth="4" strokeLinecap="round" filter="url(#glassmorphism)" />
        </g>

        {/* Connection floating elements */}
        <g stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="6,6" fill="none">
          <path d="M 170 180 Q 200 150 230 120" />
          <path d="M 300 200 Q 270 170 240 140" />
        </g>

        {/* User icon */}
        <g transform="translate(280, 190)">
          <circle cx="20" cy="15" r="12" fill="url(#connectGradient)" filter="url(#glassmorphism)" />
          <path d="M 8 35 Q 20 28 32 35 L 32 50 L 8 50 Z" fill="url(#connectGradient)" filter="url(#glassmorphism)" />
        </g>

        {/* Checkmark for verification */}
        <g transform="translate(300, 80)">
          <circle cx="20" cy="20" r="15" fill="rgba(16,185,129,0.8)" filter="url(#glassmorphism)" />
          <path d="M 12 20 L 17 25 L 28 14" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        {/* Floating accent elements */}
        <g fill="rgba(255,255,255,0.3)">
          <circle cx="80" cy="80" r="4" />
          <circle cx="320" cy="120" r="3" />
          <circle cx="60" cy="150" r="2" />
          <circle cx="340" cy="180" r="3" />
        </g>
      </svg>
    </div>
  );
}