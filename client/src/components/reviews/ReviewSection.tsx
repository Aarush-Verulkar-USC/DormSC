import { useEffect, useState } from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import { Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../ui/ConfirmModal';

function StarRating({ value, onChange, readOnly = false }: { value: number; onChange?: (v: number) => void; readOnly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}
        >
          <Star
            className={`w-5 h-5 ${(hovered || value) >= star ? 'text-gold fill-gold' : 'text-faint'}`}
          />
        </button>
      ))}
    </div>
  );
}

interface ReviewSectionProps {
  listingId: string;
  initialReviews: Review[];
  averageRating: number | null;
}

export default function ReviewSection({ listingId, initialReviews, averageRating: initialAvg }: ReviewSectionProps) {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [averageRating, setAverageRating] = useState(initialAvg);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [newForm, setNewForm] = useState({ rating: 5, title: '', comment: '' });
  const [editForm, setEditForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const userReview = currentUser ? reviews.find(r => r.user === currentUser._id) : null;

  const recalcAvg = (rs: Review[]) => {
    if (rs.length === 0) return null;
    return rs.reduce((s, r) => s + r.rating, 0) / rs.length;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.title.trim() || !newForm.comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const review = await api.createReview(listingId, newForm);
      const updated = [review, ...reviews];
      setReviews(updated);
      setAverageRating(recalcAvg(updated));
      setNewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review posted!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (review: Review) => {
    setEditingId(review._id);
    setEditForm({ rating: review.rating, title: review.title, comment: review.comment });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSubmitting(true);
    try {
      const updated = await api.updateReview(editingId, editForm);
      const updatedList = reviews.map(r => r._id === editingId ? updated : r);
      setReviews(updatedList);
      setAverageRating(recalcAvg(updatedList));
      setEditingId(null);
      toast.success('Review updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.deleteReview(deletingId);
      const updatedList = reviews.filter(r => r._id !== deletingId);
      setReviews(updatedList);
      setAverageRating(recalcAvg(updatedList));
      setDeletingId(null);
      toast.success('Review deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  useEffect(() => {
    setReviews(initialReviews);
    setAverageRating(initialAvg);
  }, [listingId]);

  const inputCls = 'bg-surface border border-line rounded-lg text-ink text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand/20 transition-colors w-full';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-ink">Reviews</h2>
        {averageRating !== null && (
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(averageRating)} readOnly />
            <span className="text-sm text-muted">{averageRating.toFixed(1)} ({reviews.length})</span>
          </div>
        )}
        {reviews.length === 0 && <span className="text-sm text-muted">No reviews yet</span>}
      </div>

      {/* Add review form */}
      {currentUser && !userReview && !editingId && (
        <form onSubmit={handleCreate} className="bg-white border border-line rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-ink mb-3">Write a Review</h3>
          <div className="mb-3">
            <label className="block text-xs text-muted mb-1">Rating</label>
            <StarRating value={newForm.rating} onChange={v => setNewForm(f => ({ ...f, rating: v }))} />
          </div>
          <div className="mb-3">
            <label className="block text-xs text-muted mb-1">Title</label>
            <input
              type="text"
              value={newForm.title}
              onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
              className={inputCls}
              placeholder="Summarize your experience"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-muted mb-1">Comment</label>
            <textarea
              value={newForm.comment}
              onChange={e => setNewForm(f => ({ ...f, comment: e.target.value }))}
              rows={3}
              className={inputCls + ' resize-none'}
              placeholder="Share your experience..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-brand hover:bg-brand/90 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {submitting ? 'Posting...' : 'Post Review'}
          </button>
        </form>
      )}

      {/* Review list */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review._id} className="bg-white border border-line rounded-xl p-4">
            {editingId === review._id ? (
              <form onSubmit={handleEdit} className="space-y-3">
                <div>
                  <label className="block text-xs text-muted mb-1">Rating</label>
                  <StarRating value={editForm.rating} onChange={v => setEditForm(f => ({ ...f, rating: v }))} />
                </div>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  className={inputCls}
                />
                <textarea
                  value={editForm.comment}
                  onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))}
                  rows={3}
                  className={inputCls + ' resize-none'}
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={submitting} className="px-3 py-1.5 bg-brand hover:bg-brand/90 text-white text-sm rounded-lg transition-colors disabled:opacity-60">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-surface hover:bg-surface text-muted text-sm rounded-lg border border-line transition-colors">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating value={review.rating} readOnly />
                      <span className="text-sm font-medium text-ink">{review.userName}</span>
                    </div>
                    <p className="text-sm font-semibold text-ink">{review.title}</p>
                    <p className="text-sm text-muted mt-1">{review.comment}</p>
                    <p className="text-xs text-muted mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  {currentUser && (review.user === currentUser._id || currentUser.role === 'admin') && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {review.user === currentUser._id && (
                        <button onClick={() => startEdit(review)} className="p-1.5 text-muted hover:text-ink hover:bg-surface rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => setDeletingId(review._id)} className="p-1.5 text-muted hover:text-danger hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {deletingId && (
        <ConfirmModal
          title="Delete Review"
          message="Are you sure you want to delete this review? This cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
