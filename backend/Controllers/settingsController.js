const db = require('../config/db');
const bcrypt = require('bcrypt');

// GET PREFERENCES
exports.getUserPreferences = async (req, res) => {
  const { email } = req.query;

  if (!email)
    return res.status(400).json({ error: 'Email is required' });

  try {
    const result = await db.query(
      'SELECT preferences FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });

    const raw = result.rows[0].preferences;
    const parsed = raw ? JSON.parse(raw) : [];

    res.json(parsed);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// SAVE PREFERENCES
exports.saveUserPreferences = async (req, res) => {
  const { email, preferences } = req.body;

  if (!email || !Array.isArray(preferences)) {
    return res.status(400).json({
      error: 'Email and preferences array are required'
    });
  }

  try {
    const result = await db.query(
      'UPDATE users SET preferences = $1 WHERE email = $2',
      [JSON.stringify(preferences), email]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Preferences saved successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({
      error: 'Missing required fields'
    });
  }

  try {
    const result = await db.query(
      'SELECT password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });

    const currentHashedPassword = result.rows[0].password;

    const isMatch = await bcrypt.compare(oldPassword, currentHashedPassword);

    if (!isMatch)
      return res.status(400).json({ error: 'Old password is incorrect' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedNewPassword, email]
    );

    res.json({ message: 'Password updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};