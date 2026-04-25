const db = require('../config/db');

// GET INGREDIENTS
exports.getIngredients = async (req, res) => {
  const { user_email } = req.query;

  try {
    let result;

    if (user_email) {
      // user-specific + global ingredients
      result = await db.query(
        `SELECT * FROM ingredients
         WHERE user_email = $1 OR user_email IS NULL`,
        [user_email]
      );
    } else {
      // only global ingredients
      result = await db.query(
        `SELECT * FROM ingredients
         WHERE user_email IS NULL`
      );
    }

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching ingredients' });
  }
};


// ADD INGREDIENT
exports.addIngredient = async (req, res) => {
  const {
    name, cost, quantity, calories,
    sodium, protein, fats, sugar,
    carbs, allergens, user_email
  } = req.body;

  // Basic validation (important for avoiding silent DB errors)
  if (!name || cost == null || quantity == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await db.query(
      `INSERT INTO ingredients
       (name, cost, quantity, calories, sodium, protein, fats, sugar, carbs, allergens, user_email)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING ingredient_id`,
      [
        name, cost, quantity, calories,
        sodium, protein, fats, sugar,
        carbs, allergens, user_email || null
      ]
    );

    res.status(201).json({
      message: 'Ingredient added successfully',
      ingredient_id: result.rows[0].ingredient_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding ingredient' });
  }
};