'use client';

import Link from 'next/link';
import { ShieldCheck, Zap, Users } from 'lucide-react';
import Threads from '@/components/Threads';

export default function HomePage() {
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-orange" />,
      title: "Verified listings",
      description: "Every property is vetted."
    },
    {
      icon: <Users className="w-5 h-5 text-orange" />,
      title: "Student focused",
      description: "Landlords who get it."
    },
    {
      icon: <Zap className="w-5 h-5 text-orange" />,
      title: "Fast process",
      description: "Secure housing in minutes."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange selection:text-white relative overflow-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 opacity-35 pointer-events-none">
        <Threads
          color={[1, 0.35, 0.12]} // Orange color in RGB (FF5A1F converted to 0-1 range)
          amplitude={0.8}
          distance={0.15}
          enableMouseInteraction={true}
        />
      </div>

      {/* Navbar spacer */}
      <div className="h-16 relative z-10"></div>

      {/* Hero Section - More Compact */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-12 md:pt-40 md:pb-16">

        {/* Badge */}
        <div className="mb-6">
          <a href="/listings" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs font-medium text-gray-300">
            <span className="flex h-2 w-2 rounded-full bg-orange"></span>
            <span>New listings added today</span>
          </a>
        </div>

        {/* Main Heading - Smaller, More Compact */}
        <div className="max-w-3xl mx-auto mb-5">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] tracking-tight">
            Find a home.
            <br />
            <span className="text-orange">Not just a house.</span>
          </h1>
        </div>

        {/* Subheading - Smaller */}
        <p className="text-base md:text-lg text-gray-400 mb-7 leading-relaxed max-w-lg mx-auto">
          Direct connections to verified landlords. No hidden fees, no complicated paperwork. Just sign and move in.
        </p>

        {/* CTA Button - Smaller */}
        <div className="mb-12">
          <Link href="/listings">
            <button className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium text-base hover:bg-gray-100 transition-all duration-300">
              <span>Browse Listings</span>
            </button>
          </Link>
        </div>

        {/* Features Grid - More Compact, Horizontal on Desktop */}
        <div className="max-w-3xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
