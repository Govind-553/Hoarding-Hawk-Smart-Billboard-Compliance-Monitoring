const supabase = require('../config/supabase');

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = user;
  next();
};

const requireOfficer = async (req, res, next) => {
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', req.user.id)
    .single();

  if (data?.role !== 'officer' && data?.role !== 'admin') {
    return res.status(403).json({ error: 'Officer access required' });
  }
  
  next();
};

module.exports = { authenticateUser, requireOfficer };