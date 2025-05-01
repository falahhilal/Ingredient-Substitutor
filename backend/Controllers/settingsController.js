const db = require('../config/db');

// GET preferences from the `user` table
exports.getUserPreferences = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = 'SELECT preferences FROM user WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const rawPreferences = results[0].preferences;
    const parsedPreferences = rawPreferences ? JSON.parse(rawPreferences) : [];

    res.status(200).json(parsedPreferences);
  });
};

// POST/UPDATE preferences in the `user` table
exports.saveUserPreferences = (req, res) => {
  const { email, preferences } = req.body;

  if (!email || !Array.isArray(preferences)) {
    return res.status(400).json({ error: 'Email and preferences array are required' });
  }

  const preferencesJSON = JSON.stringify(preferences);

  const query = 'UPDATE user SET preferences = ? WHERE email = ?';
  db.query(query, [preferencesJSON, email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Preferences saved successfully' });
  });
};