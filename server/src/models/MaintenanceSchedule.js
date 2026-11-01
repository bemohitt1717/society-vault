import mongoose from 'mongoose';

const maintenanceScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  date: { type: Date, required: true },
  time: { type: String, trim: true, maxlength: 40, default: '' },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

maintenanceScheduleSchema.index({ date: 1, status: 1 });

const MaintenanceSchedule = mongoose.model('MaintenanceSchedule', maintenanceScheduleSchema);
export default MaintenanceSchedule;
