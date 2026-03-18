'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/listings', label: 'Listings' },
  ];

  const userLinks = [
    { href: '/favorites', label: 'Favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { href: '/my-listings', label: 'My Listings', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { href: '/add-listing', label: 'Add a Listing', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-gray-900 font-bold text-lg tracking-tight">
              <Image src="/DormSC.png" alt="DormSC" width={28} height={28} className="rounded-md" />
              DormSC
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${pathname.startsWith(link.href)
                    ? 'text-brand bg-brand/10'
                    : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center text-brand text-xs font-bold">
                    {currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm text-gray-700 font-medium max-w-[120px] truncate">
                    {currentUser.email?.split('@')[0]}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 rounded-2xl py-1.5 z-50 bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.12)]" style={{ animation: 'slideDown 0.2s ease-out' }}>
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center text-brand font-bold">
                          {currentUser.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{currentUser.email?.split('@')[0]}</div>
                          <div className="text-xs text-gray-500 truncate">{currentUser.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="md:hidden px-1.5 pt-1.5">
                      <Link href="/listings" className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-colors ${pathname.startsWith('/listings') ? 'text-brand bg-brand/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        Listings
                      </Link>
                    </div>
                    <div className="px-1.5 py-1.5">
                      {userLinks.map(link => (
                        <Link key={link.href} href={link.href} className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-colors ${pathname.startsWith(link.href) ? 'text-brand bg-brand/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} /></svg>
                          {link.label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <Link href="/admin" className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-colors ${pathname === '/admin' ? 'text-red-600 bg-red-50' : 'text-red-500 hover:bg-red-50'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                          Admin
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-100/50 px-1.5 pt-1.5 pb-0.5">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/listings" className="md:hidden px-3.5 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">Listings</Link>
                <Link href="/login" className="px-4 py-1.5 rounded-full text-sm font-medium bg-brand text-white hover:bg-brand/90 transition-all">Sign In</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
