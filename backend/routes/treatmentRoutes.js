const express = require('express');
const router = express.Router();
const {
  getTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} = require('../controllers/treatmentController.js');

const { protect } = require('../middleware/auth.js');

router.route('/').get(protect, getTreatments).post(protect, createTreatment);
router.route('/:id').put(protect, updateTreatment).delete(protect, deleteTreatment);

module.exports = router;