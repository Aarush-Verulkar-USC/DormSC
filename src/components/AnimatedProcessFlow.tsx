'use client';

import { useEffect, useState } from 'react';

interface AnimatedProcessFlowProps {
  className?: string;
}

export default function AnimatedProcessFlow({ className = '' }: AnimatedProcessFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 400"
        className="w-full h-full max-w-2xl"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(59, 130, 246, 0.8)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(37, 99, 235, 0.6)' }} />
          </linearGradient>

          <linearGradient id="browseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(139, 92, 246, 0.8)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(124, 58, 237, 0.6)' }} />
          </linearGradient>

          <linearGradient id="connectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(16, 185, 129, 0.8)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(5, 150, 105, 0.6)' }} />
          </linearGradient>

          {/* Filters */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="cardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Central Device/Screen */}
        <g transform="translate(50, 120)">
          <rect
            x="0" y="0" width="200" height="140"
            rx="15"
            fill="rgba(30, 41, 59, 0.9)"
            stroke="rgba(148, 163, 184, 0.3)"
            strokeWidth="1"
            filter="url(#cardGlow)"
          />

          {/* Screen header bar */}
          <rect x="15" y="15" width="170" height="3" rx="1.5" fill="rgba(148, 163, 184, 0.4)" />
          <circle cx="25" cy="25" r="3" fill="rgba(239, 68, 68, 0.6)" />
          <circle cx="38" cy="25" r="3" fill="rgba(245, 158, 11, 0.6)" />
          <circle cx="51" cy="25" r="3" fill="rgba(34, 197, 94, 0.6)" />

          {/* Dynamic content based on current step */}
          <g transform="translate(20, 45)">
            {currentStep === 0 && (
              <g>
                {/* Search interface */}
                <rect x="0" y="0" width="160" height="20" rx="10" fill="rgba(148, 163, 184, 0.2)" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" />
                <text x="10" y="14" fontSize="8" fill="rgba(148, 163, 184, 0.7)">Search USC housing...</text>

                {/* Search icon */}
                <circle cx="145" cy="10" r="4" fill="none" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1" />
                <line x1="148" y1="13" x2="152" y2="17" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1" />

                {/* Search results appearing */}
                <g transform="translate(0, 30)">
                  <rect x="0" y="0" width="50" height="40" rx="4" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1">
                    <animate attributeName="opacity" values="0;1;0.7" dur="2s" repeatCount="indefinite" />
                  </rect>
                  <rect x="55" y="0" width="50" height="40" rx="4" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1">
                    <animate attributeName="opacity" values="0;1;0.7" dur="2s" repeatCount="indefinite" begin="0.3s" />
                  </rect>
                  <rect x="110" y="0" width="50" height="40" rx="4" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1">
                    <animate attributeName="opacity" values="0;1;0.7" dur="2s" repeatCount="indefinite" begin="0.6s" />
                  </rect>
                </g>
              </g>
            )}

            {currentStep === 1 && (
              <g>
                {/* Property listings */}
                <rect x="0" y="0" width="160" height="15" rx="2" fill="rgba(139, 92, 246, 0.3)" />
                <text x="5" y="10" fontSize="7" fill="rgba(255, 255, 255, 0.9)">Verified Properties Near USC</text>

                {/* Property cards */}
                <g transform="translate(0, 25)">
                  <rect x="0" y="0" width="45" height="35" rx="3" fill="rgba(139, 92, 246, 0.2)" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1" />
                  <rect x="50" y="0" width="45" height="35" rx="3" fill="rgba(139, 92, 246, 0.4)" stroke="rgba(139, 92, 246, 0.7)" strokeWidth="2">
                    <animate attributeName="stroke-width" values="2;3;2" dur="1.5s" repeatCount="indefinite" />
                  </rect>
                  <rect x="100" y="0" width="45" height="35" rx="3" fill="rgba(139, 92, 246, 0.2)" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1" />

                  {/* Checkmarks for verification */}
                  <circle cx="20" cy="8" r="3" fill="rgba(16, 185, 129, 0.8)" />
                  <path d="M 18 8 L 19.5 9.5 L 22 7" stroke="white" strokeWidth="0.5" fill="none" />

                  <circle cx="70" cy="8" r="3" fill="rgba(16, 185, 129, 0.8)" />
                  <path d="M 68 8 L 69.5 9.5 L 72 7" stroke="white" strokeWidth="0.5" fill="none" />

                  <circle cx="120" cy="8" r="3" fill="rgba(16, 185, 129, 0.8)" />
                  <path d="M 118 8 L 119.5 9.5 L 122 7" stroke="white" strokeWidth="0.5" fill="none" />
                </g>
              </g>
            )}

            {currentStep === 2 && (
              <g>
                {/* Connection interface */}
                <text x="0" y="10" fontSize="8" fill="rgba(16, 185, 129, 0.9)">Connect with Landlord</text>

                <g transform="translate(0, 20)">
                  {/* Student avatar */}
                  <circle cx="30" cy="20" r="12" fill="rgba(59, 130, 246, 0.6)" />
                  <circle cx="30" cy="15" r="4" fill="rgba(255, 255, 255, 0.9)" />
                  <path d="M 22 28 Q 30 24 38 28" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" fill="none" />

                  {/* Communication line */}
                  <line x1="42" y1="20" x2="118" y2="20" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="2" strokeDasharray="4,2">
                    <animate attributeName="stroke-dashoffset" values="0;-12" dur="1s" repeatCount="indefinite" />
                  </line>

                  {/* Message bubble */}
                  <ellipse cx="80" cy="10" rx="15" ry="6" fill="rgba(16, 185, 129, 0.3)" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1">
                    <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                  </ellipse>

                  {/* Landlord avatar */}
                  <circle cx="130" cy="20" r="12" fill="rgba(16, 185, 129, 0.6)" />
                  <rect x="125" y="12" width="10" height="8" rx="1" fill="rgba(255, 255, 255, 0.9)" />
                  <polygon points="125,12 130,8 135,12" fill="rgba(255, 255, 255, 0.9)" />
                </g>
              </g>
            )}
          </g>
        </g>

        {/* Floating process indicators */}
        <g className="process-steps">
          {/* Step 1: Search */}
          <g transform="translate(320, 50)">
            <rect
              x="0" y="0" width="120" height="60"
              rx="25"
              fill="url(#searchGrad)"
              filter={currentStep === 0 ? "url(#glow)" : "url(#cardGlow)"}
              opacity={currentStep === 0 ? 1 : 0.6}
            >
              <animateTransform
                attributeName="transform"
                type="scale"
                values={currentStep === 0 ? "1;1.05;1" : "1"}
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Search icon */}
            <g transform="translate(20, 20)">
              <circle cx="10" cy="10" r="8" fill="none" stroke="white" strokeWidth="2" opacity="0.9" />
              <line x1="16" y1="16" x2="22" y2="22" stroke="white" strokeWidth="2" opacity="0.9" />
            </g>

            {/* Time indicator */}
            <text x="95" y="45" fontSize="12" fill="white" opacity="0.8">2s</text>
          </g>

          {/* Step 2: Browse */}
          <g transform="translate(320, 140)">
            <rect
              x="0" y="0" width="120" height="60"
              rx="25"
              fill="url(#browseGrad)"
              filter={currentStep === 1 ? "url(#glow)" : "url(#cardGlow)"}
              opacity={currentStep === 1 ? 1 : 0.6}
            >
              <animateTransform
                attributeName="transform"
                type="scale"
                values={currentStep === 1 ? "1;1.05;1" : "1"}
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Browse/list icon */}
            <g transform="translate(20, 15)">
              <rect x="0" y="0" width="20" height="4" rx="2" fill="white" opacity="0.9" />
              <rect x="0" y="8" width="15" height="4" rx="2" fill="white" opacity="0.7" />
              <rect x="0" y="16" width="18" height="4" rx="2" fill="white" opacity="0.9" />
              <rect x="0" y="24" width="12" height="4" rx="2" fill="white" opacity="0.7" />
            </g>

            <text x="90" y="45" fontSize="12" fill="white" opacity="0.8">5s</text>
          </g>

          {/* Step 3: Connect */}
          <g transform="translate(320, 230)">
            <rect
              x="0" y="0" width="120" height="60"
              rx="25"
              fill="url(#connectGrad)"
              filter={currentStep === 2 ? "url(#glow)" : "url(#cardGlow)"}
              opacity={currentStep === 2 ? 1 : 0.6}
            >
              <animateTransform
                attributeName="transform"
                type="scale"
                values={currentStep === 2 ? "1;1.05;1" : "1"}
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Connect/handshake icon */}
            <g transform="translate(20, 20)">
              <circle cx="8" cy="8" r="6" fill="white" opacity="0.9" />
              <circle cx="20" cy="8" r="6" fill="white" opacity="0.9" />
              <rect x="8" y="14" width="12" height="6" rx="3" fill="white" opacity="0.9" />
            </g>

            <text x="85" y="45" fontSize="12" fill="white" opacity="0.8">10s</text>
          </g>
        </g>

        {/* Connecting flow lines */}
        <g stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" fill="none" strokeDasharray="5,5">
          <path d="M 250 150 Q 300 120 320 80">
            <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M 250 180 Q 285 165 320 170">
            <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite" begin="0.5s" />
          </path>
          <path d="M 250 210 Q 300 240 320 260">
            <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite" begin="1s" />
          </path>
        </g>

        {/* Progress indicator */}
        <g transform="translate(50, 320)">
          <rect x="0" y="0" width="200" height="6" rx="3" fill="rgba(255, 255, 255, 0.2)" />
          <rect x="0" y="0" width={`${((currentStep + 1) / 3) * 200}`} height="6" rx="3" fill="rgba(255, 255, 255, 0.8)">
            <animate attributeName="width" values="0;66.67;133.33;200;0" dur="9s" repeatCount="indefinite" />
          </rect>
        </g>
      </svg>
    </div>
  );
}