const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['appointment_reminder', 'reactivation', 'follow_up', 'birthday', 'payment_reminder', 'review_request', 'custom'],
    required: true
  },
  trigger: {
    event: String,
    conditions: mongoose.Schema.Types.Mixed,
    schedule: { type: String },
    delay: { value: Number, unit: { type: String, enum: ['minutes', 'hours', 'days'] } }
  },
  action: {
    type: { type: String, enum: ['whatsapp', 'sms', 'email', 'notification', 'task'] },
    template: String,
    variables: [String],
    data: mongoose.Schema.Types.Mixed
  },
  active: { type: Boolean, default: true },
  stats: {
    totalSent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    converted: { type: Number, default: 0 }
  },
  lastRun: Date,
  nextRun: Date
}, {
  timestamps: true,
  collection: 'automations'
});

module.exports = mongoose.model('Automation', automationSchema);
