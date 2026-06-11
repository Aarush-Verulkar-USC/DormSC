import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import Favorites from './pages/Favorites';
import MyListings from './pages/MyListings';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ChatWidget from './components/chat/ChatWidget';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { currentUser, isAdmin, authLoading } = useAuth();
  if (authLoading) return <LoadingSpinner />;
  if (!currentUser) return <Navigate to="/login" state={{ returnTo: window.location.pathname }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const { authLoading } = useAuth();
  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/new" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/listings/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
}
