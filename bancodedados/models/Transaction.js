const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: {
    type: String,
    enum: ['treatment', 'consultation', 'product', 'salary', 'rent', 'supplies', 'marketing', 'equipment', 'tax', 'insurance_reimbursement', 'commission', 'other'],
    required: true
  },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  dueDate: { type: Date },
  paidAt: { type: Date },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['pix', 'credit_card', 'debit_card', 'boleto', 'cash', 'transfer', 'insurance']
  },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  patientName: String,
  professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  professionalName: String,
  treatmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
  treatmentPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'TreatmentPlan' },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  installment: {
    current: Number,
    total: Number,
    parentTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }
  },
  commission: {
    professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    percentage: Number,
    amount: Number,
    paid: { type: Boolean, default: false }
  },
  invoice: {
    number: String,
    issuedAt: Date,
    url: String
  },
  notes: String,
  attachments: [String],
  recurringId: String,
  isRecurring: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'financial_transactions'
});

transactionSchema.index({ clinicId: 1, date: -1 });
transactionSchema.index({ clinicId: 1, type: 1, status: 1 });
transactionSchema.index({ clinicId: 1, patientId: 1 });
transactionSchema.index({ clinicId: 1, professionalId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
