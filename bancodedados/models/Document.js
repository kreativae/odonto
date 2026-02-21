const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', index: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['contract', 'consent', 'xray', 'photo_before', 'photo_after', 'exam', 'prescription', 'certificate', 'report', 'other'],
    required: true
  },
  category: String,
  url: { type: String, required: true },
  thumbnail: String,
  mimeType: String,
  size: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  metadata: mongoose.Schema.Types.Mixed,
  signed: { type: Boolean, default: false },
  signatureData: String,
  signedAt: Date
}, {
  timestamps: true,
  collection: 'documents'
});

documentSchema.index({ clinicId: 1, patientId: 1 });
documentSchema.index({ clinicId: 1, type: 1 });

module.exports = mongoose.model('Document', documentSchema);
