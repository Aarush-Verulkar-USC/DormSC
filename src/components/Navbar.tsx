'use client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              {/* USC Logo from web */}
              <img 
                src="/home-button.png"
                alt="USC Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/listings" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/listings' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Explore Listings
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  href="/favorites" 
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/favorites' 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Favorites
                </Link>
                
                {/* Landlord Section */}
                <div className="h-4 border-l border-gray-300 mx-2"></div>
                
                <Link 
                  href="/add-listing" 
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/add-listing' 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Add Listing
                </Link>
                <Link 
                  href="/my-listings" 
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/my-listings' 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Listings
                </Link>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500 max-w-32 truncate">
                    {currentUser.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/my-listings" 
                  className="text-gray-600 hover:text-gray-900 p-1"
                  title="My Listings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs font-medium transition-colors"
                >
                  Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}