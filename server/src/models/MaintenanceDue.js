import mongoose from 'mongoose';

const maintenanceDueSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true, trim: true, maxlength: 40 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  amount: { type: Number, required: true, min: 0 },
  penalty: { type: Number, min: 0, default: 0 },
  paidAmount: { type: Number, min: 0, default: 0 },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'partially_paid', 'paid', 'cancelled'], default: 'pending' },
}, { timestamps: true });

maintenanceDueSchema.index({ resident: 1, dueDate: -1 });
maintenanceDueSchema.index({ month: 1, resident: 1, category: 1 }, { unique: true });

const MaintenanceDue = mongoose.model('MaintenanceDue', maintenanceDueSchema);
export default MaintenanceDue;
