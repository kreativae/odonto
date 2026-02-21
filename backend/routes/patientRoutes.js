const express = require('express');
const router = express.Router();
const {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController.js');

const { protect } = require('../middleware/auth.js');

router.route('/').get(protect, getPatients).post(protect, createPatient);
router.route('/:id').put(protect, updatePatient).delete(protect, deletePatient);

module.exports = router;