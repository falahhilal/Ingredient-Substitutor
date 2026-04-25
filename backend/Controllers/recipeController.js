const db = require('../config/db');


// ADD RECIPE (PostgreSQL CLEAN VERSION)

exports.addRecipe = async (req, res) => {
  const { name, description, ingredients, user_email, visibility } = req.body;

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const recipeResult = await client.query(
      `INSERT INTO recipes (name, description, user_email, visibility)
       VALUES ($1, $2, $3, $4)
       RETURNING recipe_id`,
      [name, description, user_email, visibility || 'public']
    );

    const recipeId = recipeResult.rows[0].recipe_id;

    for (const ing of ingredients) {
      let ingredientId;

      const check = await client.query(
        `SELECT ingredient_id FROM ingredients WHERE name = $1 LIMIT 1`,
        [ing.name]
      );

      if (check.rows.length > 0) {
        ingredientId = check.rows[0].ingredient_id;
      } else {
        const inserted = await client.query(
          `INSERT INTO ingredients
           (name, quantity, calories, fats, carbs, sodium, sugar, protein, cost, user_email)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
           RETURNING ingredient_id`,
          [
            ing.name,
            ing.quantity || 1,
            ing.calories || 0,
            ing.fats || 0,
            ing.carbs || 0,
            ing.sodium || 0,
            ing.sugar || 0,
            ing.protein || 0,
            ing.cost || 0,
            user_email
          ]
        );

        ingredientId = inserted.rows[0].ingredient_id;
      }

      await client.query(
        `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
         VALUES ($1, $2, $3)`,
        [recipeId, ingredientId, ing.quantity || 1]
      );
    }

    await client.query('COMMIT');

    res.json({ success: true, recipe_id: recipeId });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to add recipe' });
  } finally {
    client.release();
  }
};



// GET RECIPES

exports.getRecipes = async (req, res) => {
  const userEmail = req.query.user_email;

  try {
    const result = await db.query(`
      SELECT 
        r.recipe_id, r.name AS recipe_name, r.description, r.user_email,
        r.visibility, r.created_at,

        ri.quantity AS ingredient_quantity,
        i.ingredient_id, i.name AS ingredient_name,
        i.cost, i.calories, i.sodium, i.protein, i.fats, i.sugar, i.carbs,

        (SELECT AVG(rating) FROM recipe_ratings WHERE recipe_id = r.recipe_id) AS avg_rating,
        (SELECT COUNT(*) FROM recipe_ratings WHERE recipe_id = r.recipe_id) AS rating_count

      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      LEFT JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      WHERE r.visibility = 'public' OR r.user_email = $1
      ORDER BY r.created_at DESC
    `, [userEmail]);

    const formatted = {};

    result.rows.forEach((row) => {
      if (!formatted[row.recipe_id]) {
        formatted[row.recipe_id] = {
          recipe_id: row.recipe_id,
          name: row.recipe_name,
          description: row.description,
          user_email: row.user_email,
          visibility: row.visibility,
          created_at: row.created_at,
          avg_rating: row.avg_rating ? Number(row.avg_rating).toFixed(1) : "0.0",
          rating_count: row.rating_count || 0,
          ingredients: []
        };
      }

      if (row.ingredient_id) {
        formatted[row.recipe_id].ingredients.push({
          ingredient_id: row.ingredient_id,
          name: row.ingredient_name,
          quantity: row.ingredient_quantity,
          cost: row.cost,
          calories: row.calories,
          fats: row.fats,
          carbs: row.carbs,
          sodium: row.sodium,
          sugar: row.sugar,
        });
      }
    });

    res.json(Object.values(formatted));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
};



// RATE RECIPE (FIXED)

exports.rateRecipe = async (req, res) => {
  const { recipe_id, user_email, rating } = req.body;

  if (!recipe_id || !user_email || !rating)
    return res.status(400).json({ message: 'Missing data' });

  try {
    await db.query(`
      INSERT INTO recipe_ratings (recipe_id, user_email, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (recipe_id, user_email)
      DO UPDATE SET rating = EXCLUDED.rating
    `, [recipe_id, user_email, rating]);

    res.json({ message: 'Rating saved successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving rating' });
  }
};



// GET RATINGS

exports.getRecipeRatings = async (req, res) => {
  const recipe_id = req.query.recipe_id;

  if (!recipe_id)
    return res.status(400).json({ message: 'Missing recipe_id' });

  try {
    const result = await db.query(`
      SELECT AVG(rating) AS avg_rating, COUNT(*) AS total_ratings
      FROM recipe_ratings
      WHERE recipe_id = $1
    `, [recipe_id]);

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ message: 'Error fetching ratings' });
  }
};



// SEARCH

exports.searchRecipes = async (req, res) => {
  const { query } = req.query;

  try {
    const result = await db.query(`
      SELECT * FROM recipes
      WHERE visibility = 'public'
      AND name ILIKE $1
    `, [`%${query}%`]);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: 'Error searching recipes' });
  }
};