const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  treatmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, default: 'Sala 1' },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed', 'missed', 'rescheduled', 'waiting'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['consultation', 'procedure', 'evaluation', 'return', 'emergency', 'cleaning'],
    default: 'consultation'
  },
  notes: { type: String },
  treatmentName: { type: String },
  patientName: { type: String },
  professionalName: { type: String },
  professionalColor: { type: String },
  duration: { type: Number, default: 30 },
  price: { type: Number, default: 0 },
  confirmedAt: { type: Date },
  confirmedVia: { type: String, enum: ['whatsapp', 'sms', 'email', 'phone', 'app'] },
  reminders: [{
    type: { type: String, enum: ['whatsapp', 'sms', 'email'] },
    sentAt: Date,
    status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'] }
  }],
  waitingList: { type: Boolean, default: false },
  recurrence: {
    enabled: { type: Boolean, default: false },
    frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'] },
    endDate: Date
  }
}, {
  timestamps: true,
  collection: 'appointments'
});

appointmentSchema.index({ clinicId: 1, date: 1 });
appointmentSchema.index({ clinicId: 1, professionalId: 1, date: 1 });
appointmentSchema.index({ clinicId: 1, patientId: 1 });
appointmentSchema.index({ clinicId: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
