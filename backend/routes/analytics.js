const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const analyticsService = require('../services/analyticsService');

const router = express.Router();

// Get dashboard analytics
router.get('/', authenticateUser, async (req, res) => {
  const analytics = await analyticsService.getDashboardStats();
  res.json(analytics);
});

// Get heatmap data
router.get('/heatmap', authenticateUser, async (req, res) => {
  const { bounds } = req.query;
  const heatmapData = await analyticsService.getHeatmapData(bounds);
  res.json(heatmapData);
});

// Get leaderboard
router.get('/leaderboard', authenticateUser, async (req, res) => {
  const { limit = 10 } = req.query;
  const leaderboard = await analyticsService.getTopCitizens(limit);
  res.json(leaderboard);
});

// Get violation trends
router.get('/trends', authenticateUser, async (req, res) => {
  const { period = '7d' } = req.query;
  const trends = await analyticsService.getViolationTrends(period);
  res.json(trends);
});

module.exports = router;