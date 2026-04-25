const db = require('../config/db');

// Find user by email
const findUserByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0]; // Postgres way
};

// Create new user
const createUser = async (email, password) => {
  const result = await db.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, password]
  );

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
};