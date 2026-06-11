import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out');
    } catch {
      toast.error('Failed to log out');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setDropdownOpen(false); }, [location.pathname]);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const userLinks = [
    { to: '/favorites', label: 'Favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { to: '/my-listings', label: 'My Listings', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { to: '/listings/new', label: 'Add a Listing', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-line">
      <div className="container-main">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <div className="flex items-center gap-7">
            <Link to="/" className="flex items-center gap-2 text-ink font-semibold text-base tracking-tight">
              <img src="/logo.png" alt="DormSC" className="w-6 h-6 object-contain" />
              DormSC
            </Link>

            {/* Desktop nav link */}
            <div className="hidden md:flex items-center gap-0.5">
              <Link to="/listings"
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive('/listings') ? 'text-brand bg-brand/10' : 'text-muted hover:text-ink hover:bg-surface'
                }`}>
                Listings
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="w-7 h-7 bg-brand/15 rounded-full flex items-center justify-center text-brand text-xs font-semibold">
                    {currentUser.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm text-ink font-medium max-w-[110px] truncate">
                    {currentUser.email.split('@')[0]}
                  </span>
                  <svg className={`w-3 h-3 text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-xl border border-line bg-white shadow-lg z-50 animate-slide-down">
                    <div className="px-4 py-3 border-b border-surface">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-brand/15 rounded-full flex items-center justify-center text-brand font-semibold text-sm">
                          {currentUser.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-ink truncate">{currentUser.name}</div>
                          <div className="text-xs text-muted truncate">{currentUser.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile-only browse link */}
                    <div className="md:hidden px-2 pt-2">
                      <Link to="/listings" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${isActive('/listings') ? 'text-brand bg-brand/10' : 'text-ink hover:bg-surface'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        Listings
                      </Link>
                    </div>

                    <div className="px-2 py-2">
                      {userLinks.map(item => (
                        <Link key={item.to} to={item.to}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${isActive(item.to) ? 'text-brand bg-brand/10' : 'text-ink hover:bg-surface'}`}>
                          <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                          </svg>
                          {item.label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <Link to="/admin"
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${isActive('/admin') ? 'text-danger bg-red-50' : 'text-danger hover:bg-red-50'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Admin
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-surface px-2 py-2">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/listings" className="md:hidden px-3 py-1.5 rounded-md text-sm text-muted hover:text-ink hover:bg-surface transition-colors">Listings</Link>
                <Link to="/login" className="px-4 py-1.5 rounded-lg text-sm font-medium bg-brand text-white hover:bg-brand/90 transition-colors">Sign In</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
