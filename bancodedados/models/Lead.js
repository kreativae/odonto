const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  patientName: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true },
  treatment: { type: String },
  treatmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
  value: { type: Number, default: 0 },
  stage: {
    type: String,
    enum: ['new_lead', 'evaluation_scheduled', 'evaluation_done', 'budget_sent', 'negotiation', 'closed_won', 'closed_lost'],
    default: 'new_lead'
  },
  professional: { type: String },
  professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  professionalColor: { type: String },
  source: { type: String, enum: ['website', 'instagram', 'facebook', 'google', 'referral', 'walkin', 'whatsapp', 'other'] },
  notes: String,
  lostReason: String,
  stageHistory: [{
    stage: String,
    enteredAt: { type: Date, default: Date.now },
    exitedAt: Date,
    duration: Number
  }],
  daysInStage: { type: Number, default: 0 },
  nextFollowUp: Date,
  tags: [String],
  score: { type: Number, default: 0, min: 0, max: 100 },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
}, {
  timestamps: true,
  collection: 'leads'
});

leadSchema.index({ clinicId: 1, stage: 1 });
leadSchema.index({ clinicId: 1, professionalId: 1 });

module.exports = mongoose.model('Lead', leadSchema);
