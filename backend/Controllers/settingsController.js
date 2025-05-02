const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getUserPreferences = (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  db.query('SELECT preferences FROM user WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const rawPreferences = results[0].preferences;
    const parsedPreferences = rawPreferences ? JSON.parse(rawPreferences) : [];
    res.status(200).json(parsedPreferences);
  });
};

exports.saveUserPreferences = (req, res) => {
  const { email, preferences } = req.body;
  if (!email || !Array.isArray(preferences)) {
    return res.status(400).json({ error: 'Email and preferences array are required' });
  }

  const preferencesJSON = JSON.stringify(preferences);
  db.query('UPDATE user SET preferences = ? WHERE email = ?', [preferencesJSON, email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'Preferences saved successfully' });
  });
};

exports.changePassword = (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.query('SELECT password FROM user WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const currentHashedPassword = results[0].password;

    // Compare old password with hashed password
    bcrypt.compare(oldPassword, currentHashedPassword, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Error verifying password' });
      if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

      // Hash new password
      bcrypt.hash(newPassword, 10, (err, hashedNewPassword) => {
        if (err) return res.status(500).json({ error: 'Error hashing new password' });

        // Update new hashed password
        db.query('UPDATE user SET password = ? WHERE email = ?', [hashedNewPassword, email], (err2) => {
          if (err2) return res.status(500).json({ error: 'Error updating password' });
          res.status(200).json({ message: 'Password updated successfully' });
        });
      });
    });
  });
};
