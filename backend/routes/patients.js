const express = require('express');
const router = express.Router();
const Patient = require('../../bancodedados/models/Patient');
const Appointment = require('../../bancodedados/models/Appointment');
const Transaction = require('../../bancodedados/models/Transaction');
const { authenticate, checkPermission } = require('../middleware/auth');

router.use(authenticate);

// GET /api/patients
router.get('/', checkPermission('patients', 'read'), async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50, sort = '-createdAt' } = req.query;
    const filter = { clinicId: req.clinicId };
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cpf: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await Patient.countDocuments(filter);
    const patients = await Patient.find(filter)
      .sort(sort).skip((page - 1) * limit).limit(parseInt(limit))
      .populate('assignedTo', 'name color');
    res.json({ patients, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patients/:id
router.get('/:id', checkPermission('patients', 'read'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, clinicId: req.clinicId })
      .populate('assignedTo', 'name color')
      .populate('clinicalEvolutions.professional', 'name color specialty');
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/patients
router.post('/', checkPermission('patients', 'create'), async (req, res) => {
  try {
    const patient = await Patient.create({ ...req.body, clinicId: req.clinicId });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/patients/:id
router.put('/:id', checkPermission('patients', 'update'), async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, clinicId: req.clinicId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/patients/:id
router.delete('/:id', checkPermission('patients', 'delete'), async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({ _id: req.params.id, clinicId: req.clinicId });
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' });
    res.json({ message: 'Paciente removido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patients/:id/appointments
router.get('/:id/appointments', checkPermission('patients', 'read'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.id, clinicId: req.clinicId })
      .sort('-date').populate('professionalId', 'name color specialty');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patients/:id/financial
router.get('/:id/financial', checkPermission('patients', 'read'), async (req, res) => {
  try {
    const transactions = await Transaction.find({ patientId: req.params.id, clinicId: req.clinicId })
      .sort('-date');
    const summary = {
      totalPaid: transactions.filter(t => t.type === 'income' && t.status === 'paid').reduce((s, t) => s + t.amount, 0),
      totalPending: transactions.filter(t => t.type === 'income' && t.status === 'pending').reduce((s, t) => s + t.amount, 0),
      totalOverdue: transactions.filter(t => t.type === 'income' && t.status === 'overdue').reduce((s, t) => s + t.amount, 0)
    };
    res.json({ transactions, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/patients/:id/evolution
router.post('/:id/evolution', checkPermission('patients', 'update'), async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, clinicId: req.clinicId },
      { $push: { clinicalEvolutions: { ...req.body, professional: req.user._id, createdAt: new Date() } } },
      { new: true }
    );
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/patients/:id/documents
router.post('/:id/documents', checkPermission('patients', 'update'), async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, clinicId: req.clinicId },
      { $push: { documents: { ...req.body, uploadedBy: req.user._id, uploadedAt: new Date() } } },
      { new: true }
    );
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/patients/:id/anamnesis
router.put('/:id/anamnesis', checkPermission('patients', 'update'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, clinicId: req.clinicId });
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' });
    if (patient.anamnesis && patient.anamnesis.chiefComplaint) {
      patient.anamnesis.versions = patient.anamnesis.versions || [];
      patient.anamnesis.versions.push({
        data: { ...patient.anamnesis.toObject() },
        updatedBy: req.user._id,
        updatedAt: new Date()
      });
    }
    patient.anamnesis = { ...req.body, lastUpdate: new Date(), versions: patient.anamnesis?.versions || [] };
    await patient.save();
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
