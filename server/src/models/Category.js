import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  type: { type: String, enum: ['income', 'expense'], required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

categorySchema.index({ type: 1, name: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
