const express = require('express');
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController.js');

const { protect } = require('../middleware/auth.js');

router.route('/').get(protect, getAppointments).post(protect, createAppointment);
router.route('/:id').put(protect, updateAppointment).delete(protect, deleteAppointment);

module.exports = router;