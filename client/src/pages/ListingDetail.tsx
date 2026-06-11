import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Ruler, Calendar, Heart, Edit2, Trash2,
  Phone, Mail, ChevronLeft, ChevronRight, User
} from 'lucide-react';
import { api } from '../lib/api';
import { Listing, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ConfirmModal from '../components/ui/ConfirmModal';
import ReviewSection from '../components/reviews/ReviewSection';
import toast from 'react-hot-toast';

// Neutral placeholder for broken image URLs — never show a stock photo of a different property
const IMG_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="#f2ede8"/><g stroke="#c4b8b0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="62" y="36" width="36" height="28" rx="3"/><path d="M62 56l9-9 7 7 6-6 14 14"/><circle cx="74" cy="45" r="2.5"/></g></svg>'
  );

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [listing, setListing] = useState<(Listing & { reviews: Review[]; averageRating: number | null; reviewCount: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIdx, setImageIdx] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getListing(id)
      .then(setListing)
      .catch(() => toast.error('Listing not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const landlordId = listing
    ? typeof listing.landlord === 'string'
      ? listing.landlord
      : listing.landlord._id
    : null;

  const isOwner = currentUser && landlordId && currentUser._id === landlordId;
  const canEdit = isOwner || isAdmin;

  const handleFavorite = async () => {
    if (!currentUser) { navigate('/login'); return; }
    setFavoriteLoading(true);
    try {
      const result = await api.toggleFavorite(id!);
      setFavorited(result.favorited);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update favorite');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteListing(id!);
      toast.success('Listing deleted');
      navigate('/my-listings');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete listing');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white"><LoadingSpinner /></div>;
  if (!listing) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-muted text-lg mb-4">Listing not found.</p>
        <Link to="/listings" className="text-brand hover:text-brand text-sm transition-colors">Back to listings</Link>
      </div>
    </div>
  );

  const images = listing.images.length > 0 ? listing.images : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main py-8">
        {/* Back */}
        <Link to="/listings" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Image gallery */}
            {images.length > 0 ? (
              <div className="mb-6">
                <div className="aspect-video rounded-xl overflow-hidden bg-surface relative mb-2">
                  <img
                    src={images[imageIdx]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = IMG_FALLBACK; }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImageIdx(i => (i - 1 + images.length) % images.length)}
                        aria-label="Previous photo"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setImageIdx(i => (i + 1) % images.length)}
                        aria-label="Next photo"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs tabular-nums">
                        {imageIdx + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setImageIdx(i)}
                        aria-label={`View photo ${i + 1}`}
                        aria-current={i === imageIdx}
                        className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === imageIdx ? 'border-brand' : 'border-line hover:border-brand/30'}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = IMG_FALLBACK; }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-surface flex items-center justify-center mb-6">
                <Bed className="w-16 h-16 text-faint" />
              </div>
            )}

            {/* Title + meta */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl font-semibold text-ink">{listing.title}</h1>
                {!listing.isActive && (
                  <span className="px-2 py-1 bg-surface text-muted text-xs rounded-full flex-shrink-0 border border-line">Inactive</span>
                )}
              </div>
              <p className="flex items-center gap-1 text-muted text-sm mb-4">
                <MapPin className="w-4 h-4" /> {listing.address}
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-line rounded-lg text-muted">
                  <Bed className="w-4 h-4 text-muted" /> {listing.bedrooms} Bed{listing.bedrooms !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-line rounded-lg text-muted">
                  <Bath className="w-4 h-4 text-muted" /> {listing.bathrooms} Bath{listing.bathrooms !== 1 ? 's' : ''}
                </span>
                {listing.distanceToUSC && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-line rounded-lg text-muted">
                    <Ruler className="w-4 h-4 text-muted" /> {listing.distanceToUSC} from USC
                  </span>
                )}
                {listing.availableDate && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-line rounded-lg text-muted">
                    <Calendar className="w-4 h-4 text-muted" /> Available {new Date(listing.availableDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-ink mb-2">Description</h2>
              <p className="text-muted text-sm leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>

            {/* Amenities */}
            {listing.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-ink mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map(a => (
                    <span key={a} className="px-3 py-1.5 bg-surface border border-line text-muted text-sm rounded-lg">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="border-t border-line pt-8">
              <ReviewSection listingId={listing._id} initialReviews={listing.reviews} averageRating={listing.averageRating ?? null} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price card */}
            <div className="bg-white border border-line rounded-xl p-5">
              <div className="text-3xl font-semibold text-ink mb-1">
                ${listing.price.toLocaleString()}<span className="text-base font-normal text-muted">/mo</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    favorited
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-surface border-line text-muted hover:text-ink hover:border-brand/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-red-400 text-red-400' : ''}`} />
                  {favorited ? 'Saved' : 'Save'}
                </button>
                {canEdit && (
                  <Link to={`/listings/${listing._id}/edit`}
                    className="flex items-center justify-center gap-1 px-3 py-2.5 bg-surface border border-line rounded-lg text-sm font-medium text-muted hover:text-ink hover:border-brand/30 transition-colors">
                    <Edit2 className="w-4 h-4" /> Edit
                  </Link>
                )}
                {canEdit && (
                  <button onClick={() => setConfirmDelete(true)}
                    className="flex items-center justify-center gap-1 px-3 py-2.5 bg-red-50 border border-red-400/30 rounded-lg text-sm font-medium text-danger hover:bg-red-400/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-white border border-line rounded-xl p-5">
              <h3 className="font-semibold text-ink mb-3">Contact</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-surface rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-muted" />
                </div>
                <span className="text-sm font-medium text-ink">{listing.contactName}</span>
              </div>
              {currentUser ? (
                showContact ? (
                  <div className="space-y-2">
                    <a href={`mailto:${listing.contactEmail}`} className="flex items-center gap-2 text-sm text-brand hover:text-brand transition-colors">
                      <Mail className="w-4 h-4" /> {listing.contactEmail}
                    </a>
                    {listing.contactPhone && (
                      <a href={`tel:${listing.contactPhone}`} className="flex items-center gap-2 text-sm text-brand hover:text-brand transition-colors">
                        <Phone className="w-4 h-4" /> {listing.contactPhone}
                      </a>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowContact(true)}
                    className="w-full py-2 bg-brand hover:bg-brand/90 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Show Contact Info
                  </button>
                )
              ) : (
                <Link
                  to="/login"
                  className="block text-center w-full py-2 bg-brand hover:bg-brand/90 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Sign in to view contact
                </Link>
              )}
            </div>

            {/* Landlord card */}
            {listing.landlord && typeof listing.landlord !== 'string' && (
              <div className="bg-white border border-line rounded-xl p-4">
                <p className="text-xs text-muted mb-1">Listed by</p>
                <p className="text-sm font-medium text-ink">{listing.landlord.name}</p>
              </div>
            )}
          </div>
        </div>

        {confirmDelete && (
          <ConfirmModal
            title="Delete Listing"
            message="Are you sure you want to delete this listing? All reviews will also be removed."
            confirmLabel={deleting ? 'Deleting...' : 'Delete'}
            danger
            onConfirm={handleDelete}
            onCancel={() => setConfirmDelete(false)}
          />
        )}
      </div>
    </div>
  );
}
