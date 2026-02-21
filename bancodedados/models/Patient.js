const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  name: { type: String, required: true, trim: true },
  cpf: { type: String, trim: true },
  birthDate: { type: Date },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  gender: { type: String, enum: ['M', 'F', 'O'] },
  address: {
    street: String, number: String, complement: String,
    neighborhood: String, city: String, state: String, zipCode: String
  },
  insurance: { type: String, trim: true },
  insuranceNumber: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'prospect'], default: 'active' },
  allergies: [{ type: String }],
  medicalNotes: { type: String },
  medicalHistory: {
    diseases: [String],
    medications: [String],
    surgeries: [String],
    habits: {
      smoking: { type: Boolean, default: false },
      alcohol: { type: Boolean, default: false },
      drugs: { type: Boolean, default: false }
    },
    pregnant: { type: Boolean, default: false },
    bloodType: String
  },
  anamnesis: {
    chiefComplaint: String,
    historyOfPresentIllness: String,
    pastMedicalHistory: String,
    familyHistory: String,
    socialHistory: String,
    reviewOfSystems: String,
    lastUpdate: Date,
    versions: [{
      data: mongoose.Schema.Types.Mixed,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      updatedAt: Date
    }]
  },
  clinicalEvolutions: [{
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['procedure', 'evaluation', 'preventive', 'routine', 'emergency'] },
    description: String,
    professional: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tooth: String,
    treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
    attachments: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  documents: [{
    name: String,
    type: { type: String, enum: ['xray', 'photo', 'contract', 'consent', 'exam', 'other'] },
    url: String,
    thumbnail: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  signatures: [{
    type: { type: String },
    documentId: String,
    signatureData: String,
    signedAt: Date,
    ip: String
  }],
  tags: [String],
  source: { type: String, enum: ['website', 'referral', 'social', 'walkin', 'other'] },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastVisit: { type: Date },
  nextVisit: { type: Date },
  totalSpent: { type: Number, default: 0 },
  ltv: { type: Number, default: 0 }
}, {
  timestamps: true,
  collection: 'patients'
});

patientSchema.index({ clinicId: 1, cpf: 1 }, { unique: true, sparse: true });
patientSchema.index({ clinicId: 1, name: 'text' });
patientSchema.index({ clinicId: 1, status: 1 });
patientSchema.index({ clinicId: 1, phone: 1 });

module.exports = mongoose.model('Patient', patientSchema);
