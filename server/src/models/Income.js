import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true, maxlength: 240 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  amount: { type: Number, required: true, min: 0.01 },
  date: { type: Date, required: true },
  paymentMode: { type: String, required: true, enum: ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Card'] },
  transactionRef: { type: String, trim: true, maxlength: 120, default: '' },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  residentName: { type: String, trim: true, maxlength: 120, default: '' },
  flat: { type: String, trim: true, maxlength: 50, default: '' },
  sourcePaymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', unique: true, sparse: true },
  remarks: { type: String, trim: true, maxlength: 1000, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

incomeSchema.index({ date: -1 });
incomeSchema.index({ category: 1, date: -1 });

const Income = mongoose.model('Income', incomeSchema);
export default Income;
