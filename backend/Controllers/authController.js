const bcrypt = require('bcrypt');
const db = require('../config/db'); 

exports.signup = (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const sql = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';

    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      res.status(201).json({ message: 'User created successfully', success: true, name: username, });
    });
  });
};


exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  const sql = 'SELECT * FROM user WHERE email = ?';

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    //no user found with that email
    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result[0];
    // Compare the password with the hashed password 
    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // User authenticated
      res.status(200).json({ message: 'Login successful', success: true, name: user.name, });
    });
  });
};