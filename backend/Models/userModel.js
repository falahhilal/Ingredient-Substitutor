const db = require('../config/db');

// Check if a user exists with email
const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM user WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results[0]);  // return first user found
  });
};

// Create a new user (for signup)
const createUser = (email, password, callback) => {
  const query = 'INSERT INTO user (email, password) VALUES (?, ?)';
  db.query(query, [email, password], (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results);
  });
};

module.exports = {
  findUserByEmail,
  createUser,
};
