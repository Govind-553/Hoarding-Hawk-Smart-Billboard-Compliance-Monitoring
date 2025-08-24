const express = require('express');
const { authenticateUser, requireOfficer } = require('../middleware/auth');
const upload = require('../middleware/upload');
const permitService = require('../services/permitService');

const router = express.Router();

// Upload permits via CSV (officers only)
router.post('/upload', authenticateUser, requireOfficer, upload.single('csv'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file required' });
  }

  const result = await permitService.uploadPermits(req.file.buffer);
  res.json(result);
});

// Get all permits
router.get('/', authenticateUser, async (req, res) => {
  const { license_id, status } = req.query;
  
  const permits = await permitService.getPermits({ license_id, status });
  res.json(permits);
});

// Add single permit (officers only)
router.post('/', authenticateUser, requireOfficer, async (req, res) => {
  const permitData = req.body;
  const permit = await permitService.createPermit(permitData);
  res.json(permit);
});

// Update permit (officers only)
router.patch('/:id', authenticateUser, requireOfficer, async (req, res) => {
  const updated = await permitService.updatePermit(req.params.id, req.body);
  res.json(updated);
});

module.exports = router;