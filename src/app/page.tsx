'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { House } from '@/types/house';
import Link from 'next/link';
import Aurora from './Aurora';
import { ChevronDown, ShieldCheck, Zap, BadgeCheck, Users, Home } from 'lucide-react';
import CardSwap, { Card } from '@/components/CardSwap';

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState<House[]>([]);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const housesQuery = query(collection(db, 'houses'), limit(3));
        const snapshot = await getDocs(housesQuery);
        const houses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as House[];
        setFeaturedListings(houses);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        // Loading state handled
      }
    };

    fetchFeaturedListings();
  }, []);

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Verified Properties",
      description: "All listings are verified by our team to ensure quality and legitimacy.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Trusted Landlords",
      description: "Connect with vetted landlords who understand student needs.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Process",
      description: "Find and secure your perfect student home in minutes, not weeks.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <BadgeCheck className="w-6 h-6" />,
      title: "Seamless Booking",
      description: "Easy online booking with transparent pricing and instant confirmation.",
      color: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen text-gray-900 dark:text-white relative overflow-x-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Hero Section - Centered */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white mb-6 animate-fadeIn">
            Find Your Perfect
            <br />
            <span className="text-gray-300">
              Student Home
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-300 mb-10 leading-relaxed animate-fadeIn max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            Streamlined housing search for USC students. Verified properties, trusted landlords, seamless booking.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Link href="/listings">
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-lg font-medium shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 min-w-[160px] text-sm">
                <Home className="w-4 h-4" />
                <span>Browse Listings</span>
              </button>
            </Link>

            <a href="https://aarush-verulkar-usc.github.io/Portfolio-Website/" target="_blank" rel="noopener noreferrer">
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-all duration-300 hover:-translate-y-0.5 min-w-[160px] text-sm">
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

      {/* Features Section */}
      <div className="relative z-10 py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]"></div>
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-block mb-4">
                  <span className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-blue-500/30">
                    TRUSTED BY USC STUDENTS
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Choose{' '}
                  <span className="text-blue-600 dark:text-blue-400">
                    DormSC
                  </span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  We've revolutionized the student housing process, making it simple, transparent, and stress-free for USC students.
                </p>
              </div>

              {/* Feature list */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    100%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    1000+
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    24/7
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Support</div>
                </div>
              </div>
            </div>

            {/* Right side - CardSwap */}
            <div className="relative h-[600px] hidden lg:block">
              <CardSwap
                width={400}
                height={500}
                cardDistance={50}
                verticalDistance={60}
                delay={2500}
                pauseOnHover={true}
                skewAmount={4}
                easing="elastic"
              >
                <Card>
                  <div className="p-8 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verified Properties</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        All listings are verified by our team to ensure quality and legitimacy. No scams, no surprises.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                      <BadgeCheck className="w-5 h-5" />
                      <span className="text-sm">100% Verified</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-8 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                        <Users className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Trusted Landlords</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Connect with vetted landlords who understand student needs and provide excellent service.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                      <BadgeCheck className="w-5 h-5" />
                      <span className="text-sm">Vetted & Trusted</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-8 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                        <Zap className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Process</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Find and secure your perfect student home in minutes, not weeks. Streamlined and efficient.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                      <BadgeCheck className="w-5 h-5" />
                      <span className="text-sm">Fast & Easy</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-8 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                        <BadgeCheck className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Seamless Booking</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Easy online booking with transparent pricing and instant confirmation. No hidden fees.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                      <BadgeCheck className="w-5 h-5" />
                      <span className="text-sm">Transparent</span>
                    </div>
                  </div>
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Getting your perfect student home is just three simple steps away.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line - Desktop */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-20" style={{ top: '3rem' }}></div>

            <div className="grid md:grid-cols-3 gap-12 lg:gap-8 relative">
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-blue-500/30">
                      1
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Search & Filter</h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Use our advanced filters to find properties that match your preferences, budget, and location needs.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-purple-500/30">
                      2
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Browse & Compare</h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    View detailed property information, photos, and reviews to compare your top choices.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-green-500/30">
                      3
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Connect & Book</h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Connect directly with landlords and secure your perfect student home with our seamless booking process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Listings Preview */}
      {featuredListings.length > 0 && (
        <div className="relative z-10 py-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
                Featured Properties
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Check out some of our most popular verified properties near USC campus.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredListings.map((house) => (
                <Link key={house.id} href={`/listing/${house.id}`}>
                  <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-2xl cursor-pointer">
                    {house.images && house.images.length > 0 && (
                      <div className="h-56 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                        <img
                          src={house.images[0]}
                          alt={house.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {house.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {house.address}
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">
                          ${house.price}<span className="text-sm font-normal text-gray-500">/mo</span>
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {house.bedrooms} bed • {house.bathrooms} bath
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/listings">
                <button className="group relative px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <span>View All Properties</span>
                  <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="relative z-10 py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 dark:from-blue-700 dark:via-purple-700 dark:to-purple-800 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of USC students who have found their ideal housing through DormSC.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/listings">
              <button className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105">
                <span>Start Your Search Today</span>
                <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </Link>
            <a href="https://aarush-verulkar-usc.github.io/Portfolio-Website/" target="_blank" rel="noopener noreferrer">
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
                Contact Us
              </button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-white/20">
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-sm text-white/80">Properties Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">1000+</div>
                <div className="text-sm text-white/80">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-white/80">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
