const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['preventive', 'restorative', 'endodontics', 'surgery', 'orthodontics', 'aesthetic', 'prosthetics', 'periodontics', 'implants', 'pediatric'],
    required: true
  },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, default: 0 },
  duration: { type: Number, default: 30 },
  popularity: { type: Number, default: 50, min: 0, max: 100 },
  active: { type: Boolean, default: true },
  steps: [{
    order: Number,
    name: String,
    description: String,
    duration: Number
  }],
  materials: [{
    name: String,
    quantity: Number,
    unitCost: Number
  }],
  sessionsRequired: { type: Number, default: 1 },
  warranty: { type: Number, default: 0 },
  notes: { type: String },
  timesPerformed: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  returnRate: { type: Number, default: 0 },
  complicationRate: { type: Number, default: 0 }
}, {
  timestamps: true,
  collection: 'treatments'
});

treatmentSchema.index({ clinicId: 1, category: 1 });
treatmentSchema.index({ clinicId: 1, active: 1 });

module.exports = mongoose.model('Treatment', treatmentSchema);
