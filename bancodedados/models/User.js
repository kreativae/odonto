const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 255,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // ← NÃO retorna por padrão. Usar .select('+password') quando precisar
  },
  phone: { type: String, trim: true },
  role: {
    type: String,
    enum: ['admin', 'dentist', 'secretary', 'financial', 'manager', 'viewer'],
    default: 'viewer',
  },
  specialty: { type: String, trim: true },
  cro: { type: String, trim: true },
  color: { type: String, default: '#3B82F6' },
  avatar: { type: String },
  active: { type: Boolean, default: true },
  lastLogin: { type: Date },
  refreshToken: { type: String, select: false }, // ← Também oculto por padrão
  permissions: {
    modules: [String],
    actions: { type: Map, of: [String] },
    units: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' }],
  },
  settings: {
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: 'pt-BR' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  // LGPD — registro de consentimento
  lgpdConsent: {
    accepted: { type: Boolean, default: false },
    acceptedAt: { type: Date },
    version: { type: String },
    ipAddress: { type: String },
  },
}, {
  timestamps: true,
  collection: 'users',
});

// ============================================================
// ÍNDICES
// ============================================================
userSchema.index({ clinicId: 1, email: 1 }, { unique: true });
userSchema.index({ clinicId: 1, role: 1 });
userSchema.index({ email: 1 });

// ============================================================
// PRE-SAVE: Hash de senha automático
// ============================================================
userSchema.pre('save', async function (next) {
  // Só faz hash se a senha foi modificada (evita re-hash)
  if (!this.isModified('password')) return next();

  // Salt factor 12 — bom equilíbrio entre segurança e performance
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ============================================================
// MÉTODO: Comparar senha
// ============================================================
userSchema.methods.comparePassword = async function (candidatePassword) {
  // 'this.password' pode estar undefined se não foi selecionado
  // Nesse caso, buscar o documento com password
  if (!this.password) {
    const user = await this.constructor.findById(this._id).select('+password');
    return bcrypt.compare(candidatePassword, user.password);
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// ============================================================
// MÉTODO: Remover campos sensíveis do JSON
// ============================================================
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
