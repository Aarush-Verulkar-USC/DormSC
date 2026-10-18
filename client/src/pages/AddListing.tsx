import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Listing } from '../types';
import ListingForm from '../components/listings/ListingForm';
import toast from 'react-hot-toast';

export default function AddListing() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: Partial<Listing>) => {
    setIsSubmitting(true);
    try {
      const listing = await api.createListing(values);
      toast.success('Listing created!');
      navigate(`/listings/${listing._id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main pt-24 pb-12">
        <h1 className="text-2xl font-semibold text-ink mb-8">Add New Listing</h1>
        <ListingForm mode="create" onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
