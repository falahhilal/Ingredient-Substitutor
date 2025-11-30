const db = require('../config/db');


// ADD RECIPE

exports.addRecipe = async (req, res) => {
  const { name, description, ingredients, user_email, visibility } = req.body;

  if (!name || !description || !ingredients || ingredients.length === 0 || !user_email) {
    return res.status(400).json({ message: 'Incomplete recipe data' });
  }

  const sqlInsertRecipe = `
    INSERT INTO recipes (name, description, user_email, visibility)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sqlInsertRecipe, [name, description, user_email, visibility || 'public'], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error saving recipe', error: err });

    const recipeId = result.insertId;

    const promises = ingredients.map((ing) => {
      return new Promise((resolve, reject) => {
        const normalized = {
          name: ing.name,
          quantity: parseFloat(ing.quantity) || 1,
          calories: parseFloat(ing.calories) || 0,
          fats: parseFloat(ing.fats) || 0,
          carbs: parseFloat(ing.carbs) || 0,
          sodium: parseFloat(ing.sodium) || 0,
          sugar: parseFloat(ing.sugar) || 0,
          protein: parseFloat(ing.protein) || 0,
          cost: parseFloat(ing.cost) || 0,
        };

        const sqlCheck = `
          SELECT ingredient_id FROM ingredients
          WHERE name = ? AND (user_email = ? OR user_email IS NULL)
          LIMIT 1
        `;

        db.query(sqlCheck, [normalized.name, user_email], (err, rows) => {
          if (err) return reject(err);

          if (rows.length > 0) {
            return resolve({ id: rows[0].ingredient_id, quantity: normalized.quantity });
          }

          const sqlInsertIng = `
            INSERT INTO ingredients 
            (name, quantity, calories, fats, carbs, sodium, sugar, protein, cost, user_email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          db.query(sqlInsertIng, [
            normalized.name, normalized.quantity, normalized.calories, normalized.fats, normalized.carbs,
            normalized.sodium, normalized.sugar, normalized.protein, normalized.cost, user_email
          ], (err2, result2) => {
            if (err2) return reject(err2);
            resolve({ id: result2.insertId, quantity: normalized.quantity });
          });
        });
      });
    });

    Promise.all(promises)
      .then((ingredientIds) => {
        const insertLinks = ingredientIds.map(({ id, quantity }) => {
          return new Promise((resolve, reject) => {
            db.query(`
              INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
              VALUES (?, ?, ?)
            `, [recipeId, id, quantity], (err) => err ? reject(err) : resolve());
          });
        });

        Promise.all(insertLinks)
          .then(() => res.status(201).json({
            message: "Recipe added successfully",
            recipe_id: recipeId
          }))
          .catch((err) => res.status(500).json({ message: "Error linking ingredients", error: err }));
      })
      .catch((err) => res.status(500).json({ message: "Ingredient processing failed", error: err }));
  });
};


// GET RECIPES → WITH AVG RATING + RATING COUNT

exports.getRecipes = (req, res) => {
  const userEmail = req.query.user_email;

  const sql = `
    SELECT 
      r.recipe_id, r.name AS recipe_name, r.description, r.user_email,
      r.visibility, r.created_at,

      ri.quantity AS ingredient_quantity,
      i.ingredient_id, i.name AS ingredient_name,
      i.cost, i.calories, i.sodium, i.protein, i.fats, i.sugar, i.carbs,

      -- AVG + COUNT rating
      (SELECT AVG(rating) FROM recipe_ratings WHERE recipe_id = r.recipe_id) AS avg_rating,
      (SELECT COUNT(*) FROM recipe_ratings WHERE recipe_id = r.recipe_id) AS rating_count

    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
    LEFT JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
    WHERE r.visibility = 'public' OR r.user_email = ?
    ORDER BY r.created_at DESC
  `;

  db.query(sql, [userEmail], (err, results) => {
    if (err)
      return res.status(500).json({ message: 'Error fetching recipes', error: err });

    const formatted = {};

    results.forEach((row) => {
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
  });
};


// RATE RECIPE

exports.rateRecipe = (req, res) => {
  const { recipe_id, user_email, rating } = req.body;

  if (!recipe_id || !user_email || !rating)
    return res.status(400).json({ message: 'Missing data' });

  const sql = `
    INSERT INTO recipe_ratings (recipe_id, user_email, rating)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE rating = ?
  `;

  db.query(sql, [recipe_id, user_email, rating, rating], (err) => {
    if (err)
      return res.status(500).json({ message: 'Error saving rating', error: err });

    res.json({ message: 'Rating saved successfully' });
  });
};


// GET AVG RATING FOR A SINGLE RECIPE

exports.getRecipeRatings = (req, res) => {
  const recipe_id = req.query.recipe_id;

  if (!recipe_id)
    return res.status(400).json({ message: 'Missing recipe_id' });

  const sql = `
    SELECT AVG(rating) AS avg_rating, COUNT(*) AS total_ratings
    FROM recipe_ratings
    WHERE recipe_id = ?
  `;

  db.query(sql, [recipe_id], (err, rows) => {
    if (err)
      return res.status(500).json({ message: 'Error fetching ratings', error: err });

    res.json(rows[0]);
  });
};

// SEARCH

exports.searchRecipes = (req, res) => {
  const { query } = req.query;

  const sql = `
    SELECT * FROM recipes
    WHERE visibility = 'public' AND name LIKE ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [`%${query}%`], (err, results) => {
    if (err)
      return res.status(500).json({ message: 'Error searching recipes', error: err });

    res.json(results);
  });
};
