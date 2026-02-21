const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  type: {
    type: String,
    enum: ['appointment', 'payment', 'lead', 'system', 'birthday', 'reminder', 'alert', 'automation'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  actionUrl: String,
  actionType: String,
  data: mongoose.Schema.Types.Mixed,
  channels: [{
    type: { type: String, enum: ['push', 'email', 'whatsapp', 'sms', 'internal'] },
    sentAt: Date,
    status: { type: String, enum: ['pending', 'sent', 'delivered', 'failed'] }
  }],
  expiresAt: Date
}, {
  timestamps: true,
  collection: 'notifications'
});

notificationSchema.index({ clinicId: 1, userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
