import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  action: { type: String, required: true, maxlength: 100 },
  entity: { type: String, required: true, maxlength: 80 },
  entityId: { type: String, default: '' },
  summary: { type: String, trim: true, maxlength: 500, default: '' },
  ipAddress: { type: String, maxlength: 80, default: '' },
  occurredAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

auditLogSchema.index({ entity: 1, occurredAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
