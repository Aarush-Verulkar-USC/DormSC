'use client';

import Link from 'next/link';
import Aurora from './Aurora';
import { ChevronDown, ShieldCheck, Zap, BadgeCheck, Users, Home } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Verified Properties",
      description: "Every listing is vetted by our team for quality and legitimacy."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Trusted Landlords",
      description: "Connect with vetted landlords who understand student needs."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Quick Process",
      description: "Find and secure your perfect student home in minutes."
    },
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      title: "Seamless Booking",
      description: "Transparent pricing and instant confirmation. No hidden fees."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#a855f7", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Hero Section - Centered */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground mb-6 animate-fadeIn">
            Find Your Perfect
            <br />
            <span className="text-muted-foreground">
              Student Home
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground mb-10 leading-relaxed animate-fadeIn max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            Streamlined housing search for USC students. Verified properties, trusted landlords, seamless booking.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Link href="/listings">
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-lg font-medium shadow-lg hover:shadow-xl hover:bg-foreground/90 transition-all duration-300 hover:-translate-y-0.5 min-w-[160px] text-sm">
                <Home className="w-4 h-4" />
                <span>Browse Listings</span>
              </button>
            </Link>

            <a href="https://aarushverulkar.dev" target="_blank" rel="noopener noreferrer">
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border-2 border-foreground text-foreground rounded-lg font-medium hover:bg-foreground hover:text-background transition-all duration-300 hover:-translate-y-0.5 min-w-[160px] text-sm">
                <span>Contact Developer</span>
              </button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
      </div>

      {/* Why Choose DormSC */}
      <div className="relative z-10 py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Why Choose DormSC
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple, transparent, stress-free housing for USC students.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to your perfect student home.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Search & Filter', desc: 'Find properties that match your preferences, budget, and location.' },
              { step: '2', title: 'Browse & Compare', desc: 'View detailed info, photos, and reviews to compare your top picks.' },
              { step: '3', title: 'Connect & Book', desc: 'Reach out to landlords directly and secure your home.' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-lg font-semibold font-mono mx-auto mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
