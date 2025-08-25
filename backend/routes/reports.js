const express = require('express');
const { authenticateUser, requireOfficer } = require('../middleware/auth');
const upload = require('../middleware/upload');
const reportService = require('../services/reportService');

const router = express.Router();

// Submit new report (authentication removed for testing)
router.post('/', upload.single('image'), async (req, res) => {
  const { gps_point, rules_triggered, local_hash } = req.body;
  const image = req.file;
  
  if (!image || !gps_point) {
    return res.status(400).json({ error: 'Image and GPS location required' });
  }

  // Hardcoded user_id for unauthenticated flow
  const report = await reportService.createReport({
    user_id: 'd9b9d9d9-d9d9-4d9d-9d9d-d9d9d9d9d9d9', 
    gps_point: JSON.parse(gps_point),
    image,
    rules_triggered: JSON.parse(rules_triggered || '{}'),
    local_hash
  });

  res.json(report);
});

// Get reports (authentication removed for testing)
router.get('/', async (req, res) => {
  const { status, violation_type, from_date, to_date } = req.query;
  
  const reports = await reportService.getReports({
    status,
    violation_type,
    from_date,
    to_date
  });

  res.json(reports);
});

// Update report status (officers only, but authentication removed for testing)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const updated = await reportService.updateReportStatus(id, status, notes);
  res.json(updated);
});

// Get single report details (authentication removed for testing)
router.get('/:id', async (req, res) => {
  const report = await reportService.getReportById(req.params.id);
  res.json(report);
});

module.exports = router;