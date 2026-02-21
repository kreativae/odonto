const asyncHandler = require('express-async-handler');
const Treatment = require('../../bancodedados/models/Treatment');
const AuditLog = require('../../bancodedados/models/AuditLog');

// @desc    Get all treatments
// @route   GET /api/treatments
// @access  Private
const getTreatments = asyncHandler(async (req, res) => {
  const treatments = await Treatment.find({ clinicId: req.user.clinicId });
  res.status(200).json(treatments);
});

// @desc    Create new treatment
// @route   POST /api/treatments
// @access  Private (Admin/Manager)
const createTreatment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    res.status(403);
    throw new Error('Permissão insuficiente');
  }

  const { name, category, price, duration, description } = req.body;

  if (!name || !price) {
    res.status(400);
    throw new Error('Nome e Preço são obrigatórios');
  }

  const treatment = await Treatment.create({
    clinicId: req.user.clinicId,
    name,
    category,
    price,
    duration,
    description,
    active: true
  });

  // Log
  await AuditLog.create({
    user: req.user.id,
    action: 'CREATE',
    entity: 'Treatment',
    entityId: treatment._id,
    details: { name, price },
    ipAddress: req.ip
  });

  res.status(201).json(treatment);
});

// @desc    Update treatment
// @route   PUT /api/treatments/:id
// @access  Private
const updateTreatment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    res.status(403);
    throw new Error('Permissão insuficiente');
  }

  const treatment = await Treatment.findById(req.params.id);

  if (!treatment) {
    res.status(404);
    throw new Error('Tratamento não encontrado');
  }

  const updatedTreatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // Log
  await AuditLog.create({
    user: req.user.id,
    action: 'UPDATE',
    entity: 'Treatment',
    entityId: updatedTreatment._id,
    details: { changes: req.body },
    ipAddress: req.ip
  });

  res.status(200).json(updatedTreatment);
});

// @desc    Delete treatment
// @route   DELETE /api/treatments/:id
// @access  Private
const deleteTreatment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Apenas admin pode excluir tratamentos');
  }

  const treatment = await Treatment.findById(req.params.id);

  if (!treatment) {
    res.status(404);
    throw new Error('Tratamento não encontrado');
  }

  await treatment.remove();

  // Log
  await AuditLog.create({
    user: req.user.id,
    action: 'DELETE',
    entity: 'Treatment',
    entityId: req.params.id,
    details: { name: treatment.name },
    ipAddress: req.ip
  });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
};