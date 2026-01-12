'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Update localStorage and document class when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false); // Close dropdown on logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/listings', label: 'Listings' },
  ];

  const userLinks = [
    { href: '/favorites', label: 'Favorites' },
    { href: '/my-listings', label: 'My Listings' },
    { href: '/add-listing', label: 'Add a Listing' },
  ];

  return (
    <>
      {/* Liquid Glass Floating Navbar */}
      <nav className="fixed top-4 left-0 right-0 z-50 transition-all duration-500 ease-out">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 px-6 rounded-full bg-black/20 backdrop-blur-lg border border-white/15 shadow-2xl">
            
            {/* Left Section: Logo and Main Nav */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="logo-text text-white font-bold text-xl tracking-tight hover:scale-105 transition-all duration-300">
                DormSC
              </Link>
              <div className="hidden md:flex items-center space-x-3">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`glass-nav-link px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      pathname.startsWith(link.href)
                        ? 'text-white glass-nav-link-active shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right Section: Auth */}
            <div className="flex items-center space-x-4">
              {/* Auth Section */}
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  {/* User Menu - Clean single dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    {/* User Avatar Button */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-3 glass-button px-3 py-2 rounded-full transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {currentUser.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium text-white">{currentUser.email?.split('@')[0]}</div>
                        <div className="text-xs text-gray-400">USC Student</div>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl py-3 z-50 animate-slideDown backdrop-blur-xl bg-gray-900/95 border border-white/20" style={{
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}>
                        {/* User Info Header */}
                        <div className="px-6 py-4 border-b border-white/20 bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                              {currentUser.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white">{currentUser.email?.split('@')[0]}</div>
                              <div className="text-xs text-gray-300">{currentUser.email}</div>
                              <div className="text-xs text-indigo-300 font-medium">USC Student</div>
                            </div>
                          </div>
                        </div>

                        {/* Navigation Links - All screen sizes */}
                        <div className="py-2">
                          <div className="px-6 py-3 bg-white/5">
                            <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Navigation</div>
                          </div>
                          {userLinks.map(link => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-2 my-1 ${
                                pathname.startsWith(link.href)
                                  ? 'text-white bg-indigo-500/20 border border-indigo-400/30 shadow-lg'
                                  : 'text-gray-200 hover:text-white hover:bg-white/10 hover:shadow-md'
                              }`}
                            >
                              {link.href === '/favorites' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              )}
                              {link.href === '/my-listings' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              )}
                              {link.href === '/add-listing' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              )}
                              <span>{link.label}</span>
                              {pathname.startsWith(link.href) && (
                                <svg className="w-4 h-4 text-indigo-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                </svg>
                              )}
                            </Link>
                          ))}
                        </div>

                        {/* Account Actions */}
                        <div className="border-t border-white/20 pt-2 mt-2">
                          <div className="px-6 py-3 bg-white/5">
                            <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Account</div>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-3 px-6 py-3 text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all duration-200 rounded-lg mx-2 my-1 hover:shadow-md"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="md:hidden rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  >
                    <Link href="/listings">Listings</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        /* Apple-style Liquid Glass Navbar */
        .liquid-glass-navbar {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-radius: 24px;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.12),
            0 2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }

        .liquid-glass-navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%);
        }

        /* Navigation Links */
        .glass-nav-link {
          position: relative;
          backdrop-filter: blur(10px);
          border: 1px solid transparent;
          overflow: hidden;
        }

        .glass-nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.05);
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .glass-nav-link:hover::before {
          opacity: 1;
        }

        .glass-nav-link-active {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        /* Glass Button (User Avatar) */
        .glass-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .glass-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow:
            0 6px 24px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        /* Enhanced Dropdown with better visibility */
        .dropdown-enhanced {
          background: rgba(17, 24, 39, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Logo Text Effect */
        .logo-text {
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.15));
        }

        /* Animations */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-16px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .liquid-glass-navbar {
            margin: 0 8px;
            border-radius: 20px;
          }
        }

        /* Enhanced blur support for Safari */
        @supports (-webkit-backdrop-filter: blur(20px)) {
          .liquid-glass-navbar {
            -webkit-backdrop-filter: blur(20px) saturate(180%);
          }
          .liquid-glass-dropdown {
            -webkit-backdrop-filter: blur(24px) saturate(180%);
          }
        }
      `}</style>
    </>
  );
}
