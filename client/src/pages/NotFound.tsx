import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-semibold text-faint mb-4">404</p>
        <h1 className="text-2xl font-semibold text-ink mb-2">Page not found</h1>
        <p className="text-muted mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
