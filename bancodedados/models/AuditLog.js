const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null para tentativas de login falhadas
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
  },
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'LOGOUT', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT', 'PASSWORD_CHANGE', 'PERMISSION_CHANGE'],
  },
  entity: {
    type: String,
    required: true,
    // Ex: 'User', 'Patient', 'Appointment', 'Financial', 'Authorization'
  },
  entityId: {
    type: String,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    // O que mudou: { before: {...}, after: {...} }
    // Ou contexto: { reason: 'Invalid password', attemptsLeft: 3 }
  },
  ipAddress: { type: String },
  userAgent: { type: String },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE'],
    default: 'SUCCESS',
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  // SEM timestamps do Mongoose (usamos nosso próprio 'timestamp')
  collection: 'audit_logs',
});

// ============================================================
// ÍNDICES
// ============================================================

// Busca rápida por usuário + data (principal query de auditoria)
auditLogSchema.index({ user: 1, timestamp: -1 });

// Busca por tipo de ação e entidade
auditLogSchema.index({ action: 1, entity: 1, timestamp: -1 });

// Busca por clínica
auditLogSchema.index({ clinicId: 1, timestamp: -1 });

// Busca por severidade (alertas de segurança)
auditLogSchema.index({ severity: 1, status: 1, timestamp: -1 });

// TTL Index — Auto-delete logs após 2 anos (730 dias)
// Requisito LGPD: não guardar dados indefinidamente
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 730 * 24 * 60 * 60 });

// ============================================================
// MÉTODO ESTÁTICO: Registrar ação facilmente
// ============================================================
auditLogSchema.statics.log = async function (data) {
  try {
    return await this.create({
      user: data.user || null,
      clinicId: data.clinicId || null,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      details: data.details,
      ipAddress: data.ipAddress || data.ip,
      userAgent: data.userAgent,
      status: data.status || 'SUCCESS',
      severity: data.severity || 'LOW',
    });
  } catch (error) {
    // Nunca deixar o audit log quebrar a aplicação
    console.error('Falha ao gravar audit log:', error.message);
    return null;
  }
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
