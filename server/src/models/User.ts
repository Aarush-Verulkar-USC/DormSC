import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  blockedAt?: Date;
  blockReason?: string;
  favoriteListings: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBlocked: { type: Boolean, default: false },
    blockedAt: { type: Date },
    blockReason: { type: String },
    favoriteListings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
