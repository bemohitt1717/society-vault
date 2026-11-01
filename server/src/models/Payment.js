import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceDue' }],
  amount: { type: Number, required: true, min: 0.01 },
  date: { type: Date, default: Date.now },
  month: { type: String, trim: true, maxlength: 40, default: '' },
  category: { type: String, trim: true, maxlength: 80, default: '' },
  paymentMode: { type: String, required: true, enum: ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Card'] },
  transactionId: { type: String, trim: true, maxlength: 120, default: '' },
  receiptNo: { type: String, trim: true, maxlength: 80, unique: true, sparse: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

paymentSchema.index({ resident: 1, date: -1 });
paymentSchema.index({ status: 1, date: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
