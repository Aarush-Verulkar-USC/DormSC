'use client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url('https://images.unsplash.com/photo-1609970105047-d0cbe314122d?w=1600&h=900&fit=crop&crop=center')`,          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-light text-gray-900 mb-6 tracking-tight">
            DormSC
          </h1>
          
          <div className="space-y-2 mb-12">
            <p className="text-2xl md:text-3xl font-light text-gray-800">
              Premium student living.
            </p>
            <p className="text-2xl md:text-3xl font-light text-gray-800">
              Premium peace of mind.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-100">
            <Link
              href="/listings"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium text-lg transition-all hover:scale-105 shadow-lg inline-block"
            >
              Explore Listings
            </Link>
            {/* {!currentUser && (
              <Link
                href="/login"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-medium text-lg transition-all hover:scale-105 inline-block"
              >
                Learn More
              </Link>
            )} */}
          </div>

          {/* Large Hero Image */}
          {/* <div className="relative max-w-5xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop"
              alt="Modern USC area apartment"
              className="w-full h-auto rounded-3xl shadow-2xl"
              style={{ 
                filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))',
                transform: 'perspective(900px) rotateX(5deg)'
              }}
            />
          </div> */}
        </div>
      </div>

      {/* Clean Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">Verified</h3>
              <p className="text-gray-600 leading-relaxed">Every property personally inspected and verified by our team.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">Located</h3>
              <p className="text-gray-600 leading-relaxed">All properties within walking distance or easy commute to USC.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">Trusted</h3>
              <p className="text-gray-600 leading-relaxed">Safe, secure platform with verified landlords and transparent pricing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}