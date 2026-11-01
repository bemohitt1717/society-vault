import mongoose from 'mongoose';

const societySettingsSchema = new mongoose.Schema({
  key: { type: String, enum: ['primary'], default: 'primary', unique: true },
  name: { type: String, required: true, trim: true, maxlength: 160 },
  address: { type: String, trim: true, maxlength: 500, default: '' },
  email: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
  registrationNumber: { type: String, trim: true, maxlength: 100, default: '' },
  financialYear: { type: String, trim: true, maxlength: 20, default: '' },
  currency: { type: String, enum: ['INR'], default: 'INR' },
  maintenanceAmount: { type: Number, min: 0, default: 0 },
  dueDate: { type: Number, min: 1, max: 28, default: 5 },
  lateFeePercentage: { type: Number, min: 0, max: 100, default: 0 },
}, { timestamps: true });

const SocietySettings = mongoose.model('SocietySettings', societySettingsSchema);
export default SocietySettings;
