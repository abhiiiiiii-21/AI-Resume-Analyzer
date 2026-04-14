const express = require('express');
const multer = require('multer');
const { calculateATS, calculateATSFromFile } = require('../controllers/atsController');

const router = express.Router();

// Store files in memory buffer
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/ats/calculate (Text Input)
router.post('/calculate', calculateATS);

// POST /api/ats/calculate-file (File Upload)
router.post('/calculate-file', upload.single('resumeFile'), calculateATSFromFile);

module.exports = router;
