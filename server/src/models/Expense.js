import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true, maxlength: 240 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  vendor: { type: String, trim: true, maxlength: 160, default: '' },
  amount: { type: Number, required: true, min: 0.01 },
  date: { type: Date, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Overdue', 'Cancelled'], default: 'Pending' },
  paymentMode: { type: String, enum: ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Card'], default: null },
  transactionRef: { type: String, trim: true, maxlength: 120, default: '' },
  hasInvoice: { type: Boolean, default: false },
  remarks: { type: String, trim: true, maxlength: 1000, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

expenseSchema.index({ date: -1 });
expenseSchema.index({ paymentStatus: 1, date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
