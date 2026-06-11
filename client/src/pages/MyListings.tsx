import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { api } from '../lib/api';
import { Listing } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ConfirmModal from '../components/ui/ConfirmModal';
import toast from 'react-hot-toast';

export default function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.getMyListings()
      .then(d => setListings(d))
      .catch(() => toast.error('Failed to load listings'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await api.deleteListing(deletingId);
      setListings(prev => prev.filter(l => l._id !== deletingId));
      toast.success('Listing deleted');
      setDeletingId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally { setDeleting(false); }
  };

  if (loading) return <div className="min-h-screen bg-white"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main pt-24 pb-12 animate-fade-in">
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-2xl font-semibold text-ink">My Listings</h1>
          <Link to="/listings/new"
            className="flex items-center gap-2 bg-brand hover:bg-brand/90 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Listing
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl font-semibold mb-2 text-muted">No listings yet</p>
            <p className="text-sm mb-7 text-muted">Create your first listing to get started</p>
            <button onClick={() => navigate('/listings/new')}
              className="bg-brand hover:bg-brand/90 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors">
              Create Listing
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map(l => (
              <div key={l._id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-line hover:border-brand/30 transition-colors">
                <div className="w-[72px] h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
                  {l.images.length > 0 && (
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-medium truncate text-ink">{l.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${
                      l.isActive
                        ? 'bg-green-50 text-green-700'
                        : 'bg-surface text-muted border border-line'
                    }`}>
                      {l.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs truncate text-muted">{l.address}</p>
                  <p className="text-sm font-semibold mt-0.5 text-ink">${l.price.toLocaleString()}/mo</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {[
                    { to: `/listings/${l._id}`, icon: <Eye className="w-4 h-4" />, title: 'View' },
                    { to: `/listings/${l._id}/edit`, icon: <Edit2 className="w-4 h-4" />, title: 'Edit' },
                  ].map(btn => (
                    <Link key={btn.to} to={btn.to} title={btn.title}
                      className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors">
                      {btn.icon}
                    </Link>
                  ))}
                  <button onClick={() => setDeletingId(l._id)} title="Delete"
                    className="p-2 rounded-lg text-muted hover:text-danger hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deletingId && (
          <ConfirmModal
            title="Delete Listing"
            message="Are you sure? This listing and all its reviews will be permanently removed."
            confirmLabel={deleting ? 'Deleting…' : 'Delete'}
            danger
            onConfirm={handleDelete}
            onCancel={() => setDeletingId(null)}
          />
        )}
      </div>
    </div>
  );
}
