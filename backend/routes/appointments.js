const express = require('express');
const router = express.Router();
const Appointment = require('../../bancodedados/models/Appointment');
const Patient = require('../../bancodedados/models/Patient');
const { authenticate, checkPermission } = require('../middleware/auth');

router.use(authenticate);

// GET /api/appointments
router.get('/', checkPermission('appointments', 'read'), async (req, res) => {
  try {
    const { date, startDate, endDate, professionalId, status, room, page = 1, limit = 100 } = req.query;
    const filter = { clinicId: req.clinicId };
    if (date) {
      const d = new Date(date);
      filter.date = { $gte: new Date(d.setHours(0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59)) };
    } else if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (professionalId) filter.professionalId = professionalId;
    if (status) filter.status = status;
    if (room) filter.room = room;

    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .sort('date startTime')
      .skip((page - 1) * limit).limit(parseInt(limit))
      .populate('patientId', 'name phone insurance allergies')
      .populate('professionalId', 'name color specialty')
      .populate('treatmentId', 'name price duration');
    res.json({ appointments, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/appointments/:id
router.get('/:id', checkPermission('appointments', 'read'), async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, clinicId: req.clinicId })
      .populate('patientId').populate('professionalId', 'name color specialty')
      .populate('treatmentId');
    if (!appointment) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/appointments
router.post('/', checkPermission('appointments', 'create'), async (req, res) => {
  try {
    const data = { ...req.body, clinicId: req.clinicId };
    // Check conflicts
    const conflict = await Appointment.findOne({
      clinicId: req.clinicId,
      professionalId: data.professionalId,
      date: data.date,
      status: { $nin: ['cancelled', 'missed'] },
      $or: [
        { startTime: { $lt: data.endTime }, endTime: { $gt: data.startTime } }
      ]
    });
    if (conflict) return res.status(409).json({ error: 'Conflito de horário com outro agendamento' });

    const appointment = await Appointment.create(data);
    // Update patient lastVisit/nextVisit
    if (data.patientId) {
      await Patient.findByIdAndUpdate(data.patientId, {
        nextVisit: data.date, lastVisit: new Date()
      });
    }
    const populated = await Appointment.findById(appointment._id)
      .populate('patientId', 'name phone insurance')
      .populate('professionalId', 'name color specialty');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/appointments/:id
router.put('/:id', checkPermission('appointments', 'update'), async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, clinicId: req.clinicId },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('patientId', 'name phone insurance')
      .populate('professionalId', 'name color specialty');
    if (!appointment) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/appointments/:id/status
router.patch('/:id/status', checkPermission('appointments', 'update'), async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'confirmed') update.confirmedAt = new Date();
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, clinicId: req.clinicId },
      { $set: update },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/appointments/:id/drag (drag & drop reschedule)
router.patch('/:id/drag', checkPermission('appointments', 'update'), async (req, res) => {
  try {
    const { date, startTime, endTime, room } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, clinicId: req.clinicId },
      { $set: { date, startTime, endTime, ...(room && { room }) } },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', checkPermission('appointments', 'delete'), async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({ _id: req.params.id, clinicId: req.clinicId });
    if (!appointment) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json({ message: 'Agendamento removido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/appointments/today/summary
router.get('/today/summary', checkPermission('appointments', 'read'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointments = await Appointment.find({
      clinicId: req.clinicId, date: { $gte: today, $lt: tomorrow }
    });
    const summary = {
      total: appointments.length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      pending: appointments.filter(a => a.status === 'pending').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      missed: appointments.filter(a => a.status === 'missed').length,
      revenue: appointments.filter(a => a.status !== 'cancelled').reduce((s, a) => s + (a.price || 0), 0)
    };
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
