import mongoose from 'mongoose';

const residentProfileSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 120 },
  phone: { type: String, trim: true, maxlength: 30 },
  flatNo: { type: String, trim: true, maxlength: 30 },
  wing: { type: String, trim: true, maxlength: 30 },
  type: { type: String, enum: ['Owner', 'Tenant'], default: 'Owner' },
  maintenanceAmount: { type: Number, min: 0, default: 0 },
  membershipStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 120, default: '' },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 254,
  },
  passwordHash: { type: String, select: false },
  firebaseUid: { type: String, unique: true, sparse: true, select: false },
  role: { type: String, enum: ['admin', 'resident'], required: true },
  status: { type: String, enum: ['active', 'invited', 'disabled'], default: 'active' },
  profileComplete: { type: Boolean, default: false },
  profile: { type: residentProfileSchema, default: null },
  lastLoginAt: { type: Date, default: null },
}, { timestamps: true });

userSchema.index({ role: 1, status: 1, email: 1 });
userSchema.index({ 'profile.flatNo': 1, 'profile.wing': 1 }, { sparse: true });

const User = mongoose.model('User', userSchema);
export default User;
