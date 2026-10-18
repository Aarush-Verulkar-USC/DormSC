import { Link } from 'react-router-dom';

const links = {
  Platform: [
    { label: 'Browse Listings', to: '/listings' },
    { label: 'Add a Listing', to: '/listings/new' },
    { label: 'My Listings', to: '/my-listings' },
    { label: 'Favorites', to: '/favorites' },
  ],
  Company: [
    { label: 'Contact', to: 'https://aarushverulkar.dev', external: true },
  ],
  Legal: [
    { label: 'Privacy, Terms & Cookies', to: '/legal' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-line">
      <div className="container-main py-14">
        <div className="lg:flex lg:items-start lg:gap-12">

          {/* Brand */}
          <div className="mb-10 lg:mb-0 lg:w-56 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 text-ink font-semibold text-base tracking-tight mb-4">
              <img src="/logo.png" alt="DormSC" className="w-6 h-6 object-contain" />
              DormSC
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Student housing near USC. Connect directly with landlords, no middlemen.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:flex-1">
            {Object.entries(links).map(([section, items]) => (
              <div key={section}>
                <p className="text-sm font-medium text-ink mb-4">{section}</p>
                <ul className="space-y-3">
                  {items.map(item => (
                    <li key={item.label}>
                      {'external' in item && item.external ? (
                        <a href={item.to} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-ink transition-colors">
                          {item.label}
                        </a>
                      ) : (
                        <Link to={item.to} className="text-sm text-muted hover:text-ink transition-colors">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar — full bleed border then contained content */}
      <div className="border-t border-line">
        <div className="container-main py-6 sm:flex sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} DormSC. All rights reserved.
          </p>
          <Link to="/legal" className="mt-4 text-xs text-muted hover:text-ink transition-colors sm:mt-0">
            Privacy · Terms · Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
