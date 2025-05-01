const db = require('../config/db');

/*exports.getIngredients = (req, res) => {
  const { user_email } = req.query;

  const sql = `
    SELECT * FROM ingredients 
    WHERE user_email = ? OR user_email IS NULL
  `;

  db.query(sql, [user_email], (err, results) => {
    if (err) {
      console.error('Error fetching ingredients:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(results);
  });
};*/

/*exports.getIngredients = (req, res) => {
  const { user_email } = req.query;

  let sql;
  let params;

  if (user_email) {
    sql = `
      SELECT * FROM ingredients 
      WHERE user_email = ? OR user_email IS NULL
    `;
    params = [user_email];
  } else {
    // Fallback to only public ingredients
    sql = `
      SELECT * FROM ingredients 
      WHERE user_email IS NULL
    `;
    params = [];
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching ingredients:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(results);
  });
};

/*exports.addIngredient = (req, res) => {
  const { name, cost, quantity, calories, sodium, protein, fats, sugar, carbs, allergens, user_email } = req.body;

  const sql = `
    INSERT INTO ingredients (name, cost, quantity, calories, sodium, protein, fats, sugar, carbs, allergens, user_email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, cost, quantity, calories, sodium, protein, fats, sugar, carbs, allergens, user_email], (err) => {
    if (err) {
      console.error('Error adding ingredient:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json({ message: 'Ingredient added successfully' });
  });
};

exports.addIngredient = (req, res) => {
  const {
    name, cost, quantity, calories,
    sodium, protein, fats, sugar,
    carbs, allergens, user_email
  } = req.body;

  if (!name || cost == null || quantity == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO ingredients 
    (name, cost, quantity, calories, sodium, protein, fats, sugar, carbs, allergens, user_email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    name, cost, quantity, calories, sodium,
    protein, fats, sugar, carbs, allergens, user_email
  ], (err) => {
    if (err) {
      console.error('Error adding ingredient:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json({ message: 'Ingredient added successfully' });
  });
}; */

// Controller to get ingredients
exports.getIngredients = (req, res) => {
  const { user_email } = req.query;

  // Check if the user_email is valid
  if (user_email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(user_email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  let sql;
  let params;

  if (user_email) {
    sql = `
      SELECT * FROM ingredients 
      WHERE user_email = ? OR user_email IS NULL
    `;
    params = [user_email];
  } else {
    // Fallback to only public ingredients
    sql = `
      SELECT * FROM ingredients 
      WHERE user_email IS NULL
    `;
    params = [];
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching ingredients:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(results);
  });
};

// Controller to add an ingredient
exports.addIngredient = (req, res) => {
  const {
    name, cost, quantity, calories,
    sodium, protein, fats, sugar,
    carbs, allergens, user_email
  } = req.body;

  // Validate the input fields
  if (!name || cost == null || quantity == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate user_email if provided
  if (user_email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(user_email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Insert the ingredient into the database
  const sql = `
    INSERT INTO ingredients 
    (name, cost, quantity, calories, sodium, protein, fats, sugar, carbs, allergens, user_email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    name, cost, quantity, calories, sodium,
    protein, fats, sugar, carbs, allergens, user_email
  ], (err, result) => {
    if (err) {
      console.error('Error adding ingredient:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Respond with a success message
    res.status(201).json({ 
      message: 'Ingredient added successfully',
      ingredient_id: result.insertId // Include the ingredient ID in the response
    });
  });
};