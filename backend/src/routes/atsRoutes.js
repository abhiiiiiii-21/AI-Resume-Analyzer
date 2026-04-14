const express = require('express');
const { calculateATS } = require('../controllers/atsController');

const router = express.Router();

// POST /api/ats/calculate
router.post('/calculate', calculateATS);

module.exports = router;
