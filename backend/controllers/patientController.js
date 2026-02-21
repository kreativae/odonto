const asyncHandler = require('express-async-handler');
const Patient = require('../../bancodedados/models/Patient');
const AuditLog = require('../../bancodedados/models/AuditLog'); // Auditoria

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({ user: req.user.id });
  res.status(200).json(patients);
});

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
const createPatient = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.cpf) {
    res.status(400);
    throw new Error('Nome e CPF são obrigatórios');
  }

  const patient = await Patient.create({
    name: req.body.name,
    cpf: req.body.cpf,
    phone: req.body.phone,
    email: req.body.email,
    user: req.user.id, // Relacionamento com o usuário logado
    // Adicione outros campos conforme necessário
  });

  // Log de Auditoria (Quem criou quem?)
  await AuditLog.create({
    user: req.user.id,
    action: 'CREATE',
    entity: 'Patient',
    entityId: patient._id,
    details: { name: patient.name, cpf: patient.cpf },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(201).json(patient);
});

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    res.status(404);
    throw new Error('Paciente não encontrado');
  }

  // Verificar se o usuário tem permissão (apenas dono ou admin)
  if (patient.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Não autorizado');
  }

  const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // Log de Auditoria
  await AuditLog.create({
    user: req.user.id,
    action: 'UPDATE',
    entity: 'Patient',
    entityId: updatedPatient._id,
    details: { changes: req.body },
    ipAddress: req.ip
  });

  res.status(200).json(updatedPatient);
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    res.status(404);
    throw new Error('Paciente não encontrado');
  }

  if (patient.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Não autorizado');
  }

  await patient.remove();

  // Log de Auditoria (Crítico!)
  await AuditLog.create({
    user: req.user.id,
    action: 'DELETE',
    entity: 'Patient',
    entityId: req.params.id,
    details: { name: patient.name },
    ipAddress: req.ip
  });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
};