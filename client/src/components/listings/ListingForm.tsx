import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Listing } from '../../types';

const USC = { lat: 34.0224, lng: -118.2851 };

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

function haversineDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }): string {
  const R = 3958.8; // miles
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const miles = R * 2 * Math.asin(Math.sqrt(h));
  return `${miles.toFixed(1)} miles`;
}

const AMENITIES = [
  'WiFi', 'Parking', 'Gym', 'Pool', 'Laundry', 'Dishwasher', 'Air Conditioning',
  'Heating', 'Pet Friendly', 'Furnished', 'Balcony', 'Storage', 'Elevator', 'Security',
];

type FormValues = {
  title: string;
  description: string;
  address: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  distanceToUSC: string;
  availableDate: string;
  amenities: string[];
  images: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
};

function toFormValues(listing?: Partial<Listing>): FormValues {
  return {
    title: listing?.title ?? '',
    description: listing?.description ?? '',
    address: listing?.address ?? '',
    price: listing?.price?.toString() ?? '',
    bedrooms: listing?.bedrooms?.toString() ?? '',
    bathrooms: listing?.bathrooms?.toString() ?? '',
    distanceToUSC: listing?.distanceToUSC ?? '',
    availableDate: listing?.availableDate ? listing.availableDate.split('T')[0] ?? '' : '',
    amenities: listing?.amenities ?? [],
    images: listing?.images?.length ? listing.images : [''],
    contactName: listing?.contactName ?? '',
    contactEmail: listing?.contactEmail ?? '',
    contactPhone: listing?.contactPhone ?? '',
    isActive: listing?.isActive ?? true,
  };
}

interface ListingFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<Listing>;
  onSubmit: (values: Partial<Listing>) => Promise<void>;
  isSubmitting: boolean;
}

export default function ListingForm({ mode, initialValues, onSubmit, isSubmitting }: ListingFormProps) {
  const [form, setForm] = useState<FormValues>(toFormValues(initialValues));
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const update = (key: keyof FormValues, value: FormValues[keyof FormValues]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormValues, string>> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Valid price is required';
    if (!form.bedrooms || isNaN(Number(form.bedrooms))) e.bedrooms = 'Bedrooms is required';
    if (!form.bathrooms || isNaN(Number(form.bathrooms))) e.bathrooms = 'Bathrooms is required';
    if (!form.contactName.trim()) e.contactName = 'Contact name is required';
    if (!form.contactEmail.trim()) e.contactEmail = 'Contact email is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Auto-geocode the address, then calculate distance to USC
    const coords = await geocodeAddress(form.address);
    const distanceToUSC = coords
      ? haversineDistance(USC, coords)
      : (form.distanceToUSC || undefined);

    await onSubmit({
      title: form.title,
      description: form.description,
      address: form.address,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      latitude: coords?.lat,
      longitude: coords?.lng,
      distanceToUSC,
      availableDate: form.availableDate || undefined,
      amenities: form.amenities,
      images: form.images.filter(Boolean),
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone || undefined,
      isActive: form.isActive,
    });
  };

  const toggleAmenity = (a: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const updateImage = (idx: number, value: string) => {
    const images = [...form.images];
    images[idx] = value;
    update('images', images);
  };

  const addImage = () => {
    if (form.images.length < 10) update('images', [...form.images, '']);
  };

  const removeImage = (idx: number) => {
    update('images', form.images.filter((_, i) => i !== idx));
  };

  const inputCls = (err?: string) =>
    `bg-surface border ${err ? 'border-red-400' : 'border-line'} rounded-lg text-ink text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand/20 transition-colors w-full`;

  const sectionHeader = 'text-ink font-semibold text-sm mb-4 pb-2 border-b border-line';
  const labelCls = 'block text-xs text-muted mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Property Details */}
      <section>
        <h2 className={sectionHeader}>Property Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Title <span className="text-danger">*</span></label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)} className={inputCls(errors.title)} placeholder="e.g. Cozy 2BR near USC Village" />
            {errors.title && <p className="mt-1 text-xs text-danger">{errors.title}</p>}
          </div>
          <div>
            <label className={labelCls}>Price ($/month) <span className="text-danger">*</span></label>
            <input type="number" value={form.price} onChange={e => update('price', e.target.value)} className={inputCls(errors.price)} placeholder="2500" min="0" />
            {errors.price && <p className="mt-1 text-xs text-danger">{errors.price}</p>}
          </div>
          <div>
            <label className={labelCls}>Bedrooms <span className="text-danger">*</span></label>
            <input type="number" value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} className={inputCls(errors.bedrooms)} placeholder="2" min="0" />
            {errors.bedrooms && <p className="mt-1 text-xs text-danger">{errors.bedrooms}</p>}
          </div>
          <div>
            <label className={labelCls}>Bathrooms <span className="text-danger">*</span></label>
            <input type="number" value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} className={inputCls(errors.bathrooms)} placeholder="1" min="0" step="0.5" />
            {errors.bathrooms && <p className="mt-1 text-xs text-danger">{errors.bathrooms}</p>}
          </div>
          <div>
            <label className={labelCls}>Available Date</label>
            <input type="date" value={form.availableDate} onChange={e => update('availableDate', e.target.value)} className={inputCls()} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Address <span className="text-danger">*</span></label>
            <input type="text" value={form.address} onChange={e => update('address', e.target.value)} className={inputCls(errors.address)} placeholder="123 W 24th St, Los Angeles, CA 90007" />
            {errors.address && <p className="mt-1 text-xs text-danger">{errors.address}</p>}
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Description <span className="text-danger">*</span></label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} className={inputCls(errors.description) + ' resize-none'} placeholder="Describe the property..." />
            {errors.description && <p className="mt-1 text-xs text-danger">{errors.description}</p>}
          </div>
          {mode === 'edit' && (
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={e => update('isActive', e.target.checked)}
                className="w-4 h-4 rounded accent-brand"
              />
              <label htmlFor="isActive" className="text-sm text-muted">Listing is active</label>
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className={sectionHeader}>Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Contact Name <span className="text-danger">*</span></label>
            <input type="text" value={form.contactName} onChange={e => update('contactName', e.target.value)} className={inputCls(errors.contactName)} placeholder="Your name" />
            {errors.contactName && <p className="mt-1 text-xs text-danger">{errors.contactName}</p>}
          </div>
          <div>
            <label className={labelCls}>Contact Email <span className="text-danger">*</span></label>
            <input type="email" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} className={inputCls(errors.contactEmail)} placeholder="your@email.com" />
            {errors.contactEmail && <p className="mt-1 text-xs text-danger">{errors.contactEmail}</p>}
          </div>
          <div>
            <label className={labelCls}>Phone (optional)</label>
            <input type="tel" value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} className={inputCls()} placeholder="(555) 000-0000" />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section>
        <h2 className={sectionHeader}>Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {AMENITIES.map(a => (
            <label key={a} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                className="w-4 h-4 rounded accent-brand"
              />
              <span className="text-sm text-muted group-hover:text-ink transition-colors">{a}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Images */}
      <section>
        <h2 className={sectionHeader}>Images (URLs)</h2>
        <div className="space-y-2">
          {form.images.map((img, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="url"
                value={img}
                onChange={e => updateImage(idx, e.target.value)}
                className="flex-1 bg-surface border border-line rounded-lg text-ink text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand/20 transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              {form.images.length > 1 && (
                <button type="button" onClick={() => removeImage(idx)} className="p-2.5 text-danger hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {form.images.length < 10 && (
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-1 text-sm text-brand hover:text-brand font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add image
            </button>
          )}
        </div>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-brand hover:bg-brand/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : mode === 'create' ? 'Post Listing' : 'Save Changes'}
      </button>
    </form>
  );
}
