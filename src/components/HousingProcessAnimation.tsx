'use client';

import { useState, useEffect } from 'react';

interface DormSCFlowAnimationProps {
  className?: string;
}

export default function DormSCFlowAnimation({ className = '' }: DormSCFlowAnimationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 600"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.1))' }}
      >
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#667eea' }} />
            <stop offset="100%" style={{ stopColor: '#764ba2' }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="500" height="600" fill="url(#bgGradient)" rx="20" />

        {/* Step 1: Search */}
        <g transform="translate(50, 50)" className={`transition-all duration-1000 ${step === 0 ? 'opacity-100' : 'opacity-40'}`}>
          <rect width="400" height="140" fill="white" rx="15" className="drop-shadow-lg" />

          {/* Step indicator */}
          <circle cx="30" cy="30" r="20" fill="#3B82F6" />
          <text x="30" y="37" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">1</text>

          {/* Content */}
          <text x="70" y="35" fontSize="20" fontWeight="bold" fill="#1F2937">Search Properties</text>

          {/* Search visualization */}
          <g transform="translate(80, 60)">
            {/* Search bar */}
            <rect x="0" y="0" width="240" height="40" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" rx="20" />
            <text x="20" y="25" fontSize="14" fill="#6B7280">Find your perfect home near USC...</text>

            {/* Search icon */}
            <circle cx="210" cy="20" r="8" fill="none" stroke="#3B82F6" strokeWidth="2" />
            <line x1="216" y1="26" x2="222" y2="32" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />

            {step === 0 && (
              <g>
                {/* Animated search results */}
                <g transform="translate(260, 10)" opacity="0">
                  <rect width="60" height="20" fill="#EF4444" rx="4" />
                  <text x="30" y="15" textAnchor="middle" fontSize="10" fill="white">3 BR</text>
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                </g>
                <g transform="translate(260, 35)" opacity="0">
                  <rect width="60" height="20" fill="#10B981" rx="4" />
                  <text x="30" y="15" textAnchor="middle" fontSize="10" fill="white">2 BR</text>
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.7s" />
                </g>
              </g>
            )}
          </g>
        </g>

        {/* Flow arrow 1 */}
        <g className={`transition-opacity duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-30'}`}>
          <path d="M 250 190 L 250 220" stroke="#4F46E5" strokeWidth="4" markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#4F46E5" />
            </marker>
          </defs>
        </g>

        {/* Step 2: Browse */}
        <g transform="translate(50, 220)" className={`transition-all duration-1000 ${step === 1 ? 'opacity-100' : 'opacity-40'}`}>
          <rect width="400" height="140" fill="white" rx="15" className="drop-shadow-lg" />

          {/* Step indicator */}
          <circle cx="30" cy="30" r="20" fill="#8B5CF6" />
          <text x="30" y="37" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">2</text>

          {/* Content */}
          <text x="70" y="35" fontSize="20" fontWeight="bold" fill="#1F2937">Browse Verified Listings</text>

          {/* Property cards */}
          <g transform="translate(80, 55)">
            {/* Card 1 */}
            <g>
              <rect x="0" y="0" width="70" height="60" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" rx="8" />
              <rect x="10" y="10" width="20" height="15" fill="#EF4444" />
              <polygon points="10,10 20,5 30,10" fill="#DC2626" />
              <circle cx="55" cy="15" r="6" fill="#10B981" />
              <text x="55" y="18" textAnchor="middle" fontSize="8" fill="white">✓</text>
              <text x="35" y="40" textAnchor="middle" fontSize="10" fill="#6B7280">$1200</text>
              <text x="35" y="52" textAnchor="middle" fontSize="8" fill="#9CA3AF">2BR/1BA</text>
            </g>

            {/* Card 2 (featured) */}
            <g transform="translate(85, 0)">
              <rect x="0" y="0" width="70" height="60" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" rx="8" className={step === 1 ? 'animate-pulse' : ''} />
              <rect x="10" y="10" width="20" height="15" fill="#3B82F6" />
              <polygon points="10,10 20,5 30,10" fill="#1E40AF" />
              <circle cx="55" cy="15" r="6" fill="#10B981" />
              <text x="55" y="18" textAnchor="middle" fontSize="8" fill="white">✓</text>
              <text x="35" y="40" textAnchor="middle" fontSize="10" fill="#6B7280">$950</text>
              <text x="35" y="52" textAnchor="middle" fontSize="8" fill="#9CA3AF">3BR/2BA</text>
              {step === 1 && (
                <rect x="-2" y="-2" width="74" height="64" fill="none" stroke="#F59E0B" strokeWidth="2" rx="10" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" values="0;-20" dur="1.5s" repeatCount="indefinite" />
                </rect>
              )}
            </g>

            {/* Card 3 */}
            <g transform="translate(170, 0)">
              <rect x="0" y="0" width="70" height="60" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" rx="8" />
              <rect x="10" y="10" width="20" height="15" fill="#10B981" />
              <polygon points="10,10 20,5 30,10" fill="#059669" />
              <circle cx="55" cy="15" r="6" fill="#10B981" />
              <text x="55" y="18" textAnchor="middle" fontSize="8" fill="white">✓</text>
              <text x="35" y="40" textAnchor="middle" fontSize="10" fill="#6B7280">$875</text>
              <text x="35" y="52" textAnchor="middle" fontSize="8" fill="#9CA3AF">1BR/1BA</text>
            </g>
          </g>
        </g>

        {/* Flow arrow 2 */}
        <g className={`transition-opacity duration-1000 ${step >= 2 ? 'opacity-100' : 'opacity-30'}`}>
          <path d="M 250 360 L 250 390" stroke="#4F46E5" strokeWidth="4" markerEnd="url(#arrow)" />
        </g>

        {/* Step 3: Connect */}
        <g transform="translate(50, 390)" className={`transition-all duration-1000 ${step === 2 ? 'opacity-100' : 'opacity-40'}`}>
          <rect width="400" height="140" fill="white" rx="15" className="drop-shadow-lg" />

          {/* Step indicator */}
          <circle cx="30" cy="30" r="20" fill="#10B981" />
          <text x="30" y="37" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">3</text>

          {/* Content */}
          <text x="70" y="35" fontSize="20" fontWeight="bold" fill="#1F2937">Connect & Finalize</text>

          {/* Communication visualization */}
          <g transform="translate(80, 55)">
            {/* Student */}
            <g>
              <circle cx="50" cy="30" r="25" fill="#3B82F6" />
              <text x="50" y="37" textAnchor="middle" fontSize="24" fill="white">👤</text>
              <text x="50" y="70" textAnchor="middle" fontSize="12" fill="#6B7280">Student</text>
            </g>

            {/* Communication line */}
            {step === 2 && (
              <g>
                <line x1="75" y1="30" x2="175" y2="30" stroke="#10B981" strokeWidth="3" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" values="0;-20" dur="1s" repeatCount="indefinite" />
                </line>
                {/* Message bubble */}
                <ellipse cx="125" cy="15" rx="20" ry="8" fill="#E5E7EB" opacity="0">
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                </ellipse>
                <text x="125" y="18" textAnchor="middle" fontSize="8" fill="#374151" opacity="0">
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                  Interested!
                </text>
              </g>
            )}

            {/* Landlord */}
            <g transform="translate(150, 0)">
              <circle cx="50" cy="30" r="25" fill="#10B981" />
              <text x="50" y="37" textAnchor="middle" fontSize="20" fill="white">🏠</text>
              <text x="50" y="70" textAnchor="middle" fontSize="12" fill="#6B7280">Landlord</text>
            </g>

            {/* Success checkmark */}
            {step === 2 && (
              <g transform="translate(280, 15)">
                <circle cx="15" cy="15" r="15" fill="#10B981" opacity="0">
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="1s" />
                </circle>
                <path d="M 8 15 L 12 19 L 22 9" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0">
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="1s" />
                </path>
              </g>
            )}
          </g>
        </g>

        {/* Progress dots */}
        <g transform="translate(200, 560)">
          <circle cx="0" cy="0" r="8" fill={step >= 0 ? "#3B82F6" : "#E5E7EB"} className="transition-colors duration-500" />
          <circle cx="30" cy="0" r="8" fill={step >= 1 ? "#8B5CF6" : "#E5E7EB"} className="transition-colors duration-500" />
          <circle cx="60" cy="0" r="8" fill={step >= 2 ? "#10B981" : "#E5E7EB"} className="transition-colors duration-500" />

          {/* Active indicator */}
          <circle cx={step * 30} cy="0" r="12" fill="none" stroke="white" strokeWidth="2" opacity="0.8">
            <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}