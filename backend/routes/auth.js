const express = require('express');
const supabase = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { email, phone, password, name, role = 'citizen' } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email: email || `${phone}@temp.com`, // Supabase requires email
    password,
    phone,
    options: {
      data: { name, role }
    }
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Create user profile
  if (data.user) {
    await supabase.from('users').insert({
      id: data.user.id,
      role,
      name,
      email,
      phone,
      trust_score: 0
    });
  }

  res.json({ user: data.user, session: data.session });
});

// Login user
router.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email || `${phone}@temp.com`,
    password
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ user: data.user, session: data.session });
});

// Get current user profile
router.get('/profile', authenticateUser, async (req, res) => {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();

  res.json(data);
});

// Update user profile
router.patch('/profile', authenticateUser, async (req, res) => {
  const { name, phone } = req.body;
  
  const { data } = await supabase
    .from('users')
    .update({ name, phone })
    .eq('id', req.user.id)
    .select()
    .single();

  res.json(data);
});

// Logout
router.post('/logout', authenticateUser, async (req, res) => {
  await supabase.auth.signOut();
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;