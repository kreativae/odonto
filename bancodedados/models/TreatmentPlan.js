const mongoose = require('mongoose');

const treatmentPlanSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  procedures: [{
    treatmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
    name: String,
    tooth: String,
    price: Number,
    discount: Number,
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
    sessions: { total: Number, completed: { type: Number, default: 0 } },
    notes: String
  }],
  totalValue: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  finalValue: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['draft', 'sent', 'approved', 'in_progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  paymentPlan: {
    method: { type: String, enum: ['pix', 'credit_card', 'debit_card', 'boleto', 'cash', 'insurance'] },
    installments: { type: Number, default: 1 },
    installmentValue: Number,
    downPayment: Number
  },
  signature: {
    signed: { type: Boolean, default: false },
    signatureData: String,
    signedAt: Date,
    ip: String
  },
  validUntil: { type: Date },
  notes: String
}, {
  timestamps: true,
  collection: 'treatment_plans'
});

treatmentPlanSchema.index({ clinicId: 1, patientId: 1 });
treatmentPlanSchema.index({ clinicId: 1, status: 1 });

module.exports = mongoose.model('TreatmentPlan', treatmentPlanSchema);
