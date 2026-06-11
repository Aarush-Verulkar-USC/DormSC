import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  _id: Types.ObjectId;
  listing: Types.ObjectId;
  user: Types.ObjectId;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ listing: 1, user: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
