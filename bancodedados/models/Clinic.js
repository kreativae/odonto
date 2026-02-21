const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  cnpj: { type: String, trim: true },
  address: {
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
  },
  phone: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  logo: { type: String },
  active: { type: Boolean, default: true },
  plan: {
    type: String,
    enum: ['starter', 'pro', 'enterprise'],
    default: 'starter',
  },
  planExpiresAt: { type: Date },
  settings: {
    timezone: { type: String, default: 'America/Sao_Paulo' },
    currency: { type: String, default: 'BRL' },
    appointmentDuration: { type: Number, default: 30 },
    workingHours: {
      start: { type: String, default: '08:00' },
      end: { type: String, default: '18:00' },
    },
    workingDays: { type: [Number], default: [1, 2, 3, 4, 5] }, // Mon-Fri
  },
  lgpd: {
    consentTemplate: { type: String },
    dataRetentionDays: { type: Number, default: 1825 }, // 5 anos
    dpoName: { type: String },
    dpoEmail: { type: String },
  },
}, {
  timestamps: true,
  collection: 'clinics',
});

clinicSchema.index({ cnpj: 1 }, { sparse: true });

module.exports = mongoose.model('Clinic', clinicSchema);
