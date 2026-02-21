const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  module: { type: String, required: true },
  details: mongoose.Schema.Types.Mixed,
  entityType: String,
  entityId: { type: mongoose.Schema.Types.ObjectId },
  previousData: mongoose.Schema.Types.Mixed,
  newData: mongoose.Schema.Types.Mixed,
  ip: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'logs',
  capped: { size: 104857600, max: 500000 }
});

logSchema.index({ clinicId: 1, timestamp: -1 });
logSchema.index({ clinicId: 1, module: 1 });

module.exports = mongoose.model('Log', logSchema);
