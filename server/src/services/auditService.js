import AuditLog from '../models/AuditLog.js';

const recordAuditEvent = ({ actor, action, entity, entityId, summary, ipAddress }) => (
  AuditLog.create({
    actor: actor?._id || actor || null,
    action,
    entity,
    entityId: entityId?.toString() || '',
    summary: summary || '',
    ipAddress: ipAddress || '',
  })
);

export default recordAuditEvent;
