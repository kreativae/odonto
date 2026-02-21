const asyncHandler = require('express-async-handler');
const Appointment = require('../../bancodedados/models/Appointment');
const AuditLog = require('../../bancodedados/models/AuditLog');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ clinicId: req.user.clinicId });
  res.status(200).json(appointments);
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { date, startTime, endTime, patientId, professionalId, treatmentId, room } = req.body;

  if (!date || !startTime || !patientId || !professionalId) {
    res.status(400);
    throw new Error('Preencha todos os campos obrigatórios');
  }

  // 1. Verificar conflito de horário
  const conflictingAppointment = await Appointment.findOne({
    professionalId,
    date,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  });

  if (conflictingAppointment) {
    res.status(409); // Conflict
    throw new Error('Horário indisponível para este profissional');
  }

  const appointment = await Appointment.create({
    clinicId: req.user.clinicId, // Assumindo que o token JWT tem o ID da clínica
    patientId,
    professionalId,
    treatmentId,
    date,
    startTime,
    endTime,
    room,
    status: 'pending'
  });

  // Log de Auditoria
  await AuditLog.create({
    user: req.user.id,
    action: 'CREATE',
    entity: 'Appointment',
    entityId: appointment._id,
    details: { date, startTime, patientId },
    ipAddress: req.ip
  });

  res.status(201).json(appointment);
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Consulta não encontrada');
  }

  // Verificar permissão
  if (appointment.clinicId.toString() !== req.user.clinicId && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Não autorizado');
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // Log de Auditoria
  await AuditLog.create({
    user: req.user.id,
    action: 'UPDATE',
    entity: 'Appointment',
    entityId: updatedAppointment._id,
    details: { changes: req.body },
    ipAddress: req.ip
  });

  res.status(200).json(updatedAppointment);
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Consulta não encontrada');
  }

  if (appointment.clinicId.toString() !== req.user.clinicId && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Não autorizado');
  }

  await appointment.remove();

  // Log de Auditoria
  await AuditLog.create({
    user: req.user.id,
    action: 'DELETE',
    entity: 'Appointment',
    entityId: req.params.id,
    details: { reason: 'Cancelado pelo usuário' },
    ipAddress: req.ip
  });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};