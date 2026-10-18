import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Listing } from '../types';
import ListingForm from '../components/listings/ListingForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getListing(id)
      .then(setListing)
      .catch(() => toast.error('Failed to load listing'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values: Partial<Listing>) => {
    setIsSubmitting(true);
    try {
      await api.updateListing(id!, values);
      toast.success('Listing updated!');
      navigate(`/listings/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white"><LoadingSpinner /></div>;
  if (!listing) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <p className="text-muted">Listing not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main pt-24 pb-12">
        <h1 className="text-2xl font-semibold text-ink mb-8">Edit Listing</h1>
        <ListingForm mode="edit" initialValues={listing} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
