const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const permitRoutes = require('./routes/permits');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/auth', authRoutes);
app.use('/reports', reportRoutes);
app.use('/permits', permitRoutes);
app.use('/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Billboard Monitor API v1.0' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});