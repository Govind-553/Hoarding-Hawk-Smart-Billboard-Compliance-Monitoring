const express = require('express');
const { authenticateUser, requireOfficer } = require('../middleware/auth');
const upload = require('../middleware/upload');
const reportService = require('../services/reportService');

const router = express.Router();

// Submit new report
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
  const { gps_point, rules_triggered, local_hash } = req.body;
  const image = req.file;
  
  if (!image || !gps_point) {
    return res.status(400).json({ error: 'Image and GPS location required' });
  }

  const report = await reportService.createReport({
    user_id: req.user.id,
    gps_point: JSON.parse(gps_point),
    image,
    rules_triggered: JSON.parse(rules_triggered || '{}'),
    local_hash
  });

  res.json(report);
});

// Get reports (with filters)
router.get('/', authenticateUser, async (req, res) => {
  const { status, violation_type, from_date, to_date } = req.query;
  
  const reports = await reportService.getReports({
    status,
    violation_type,
    from_date,
    to_date
  });

  res.json(reports);
});

// Update report status (officers only)
router.patch('/:id', authenticateUser, requireOfficer, async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const updated = await reportService.updateReportStatus(id, status, notes);
  res.json(updated);
});

// Get single report details
router.get('/:id', authenticateUser, async (req, res) => {
  const report = await reportService.getReportById(req.params.id);
  res.json(report);
});

module.exports = router;