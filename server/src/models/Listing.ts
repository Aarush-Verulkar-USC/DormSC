import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IListing extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  distanceToUSC?: string;
  availableDate?: Date;
  amenities: string[];
  images: string[];
  isActive: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  landlord: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    address: { type: String, required: true, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    price: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    distanceToUSC: { type: String },
    availableDate: { type: Date },
    amenities: [{ type: String }],
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    landlord: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

ListingSchema.index({ title: 'text', description: 'text', address: 'text' });

export const Listing = mongoose.model<IListing>('Listing', ListingSchema);
