const db = require('../config/db');

exports.addRecipe = (req, res) => {
  const { name, description, ingredients, user_email } = req.body;

  if (!name || !description || ingredients.length === 0) {
    return res.status(400).json({ message: 'Incomplete recipe data' });
  }

  const sqlInsertRecipe = 'INSERT INTO recipes (name, description, user_email) VALUES (?, ?, ?)';
  db.query(sqlInsertRecipe, [name, description, user_email], (err, result) => {
    if (err) {
      console.error('Error inserting recipe:', err);
      return res.status(500).json({ message: 'Error saving recipe' });
    }

    const recipeId = result.insertId;

    // Insert ingredients if they don't exist already
    const promises = ingredients.map(ing => {
      return new Promise((resolve, reject) => {
        // Check if the ingredient already exists
        const sqlGetIngredientId = `
          SELECT ingredient_id FROM ingredients
          WHERE name = ? AND (user_email = ? OR user_email IS NULL)
          LIMIT 1
        `;
        db.query(sqlGetIngredientId, [ing.name, user_email], (err, results) => {
          if (err) {
            reject(err);
            return;
          }

          let ingredientId = results.length > 0 ? results[0].ingredient_id : null;

          if (!ingredientId) {
            // Ingredient does not exist, so insert a new one
            const sqlInsertIngredient = `
              INSERT INTO ingredients (name, quantity, calories, fats, carbs, sodium, sugar, protein, cost, user_email)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(sqlInsertIngredient, [
              ing.name || '', 
              ing.quantity || 0, 
              ing.calories || 0, 
              ing.fats || 0, 
              ing.carbs || 0,
              ing.sodium || 0, 
              ing.sugar || 0, 
              ing.protein || 0, 
              ing.cost || 0, 
              user_email || null
            ], (err, insertResult) => {
              if (err) {
                reject(err);
                return;
              }
              ingredientId = insertResult.insertId;
              resolve({ id: ingredientId, quantity: ing.quantity || 1 });
            });
          } else {
            resolve({ id: ingredientId, quantity: ing.quantity || 1 });
          }
        });
      });
    });

    // all ingredients are inserted or found, link them to the recipe
    Promise.all(promises)
      .then(ingredientIds => {
        // Link ingredients to recipe
        const ingredientPromises = ingredientIds.map(({ id, quantity }) => {
          return new Promise((resolve, reject) => {
            const sqlInsertRecipeIngredient = `
              INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
              VALUES (?, ?, ?)
            `;
            db.query(sqlInsertRecipeIngredient, [recipeId, id, quantity], (err) => {
              if (err) {
                reject(err);
                return;
              }
              resolve();
            });
          });
        });

        Promise.all(ingredientPromises)
          .then(() => {
            res.status(201).json({ message: 'Recipe added successfully', recipeId });
          })
          .catch(err => {
            console.error('Error linking ingredients to recipe:', err);
            res.status(500).json({ message: 'Error linking ingredients to recipe' });
          });
      })
      .catch(err => {
        console.error('Error handling ingredients:', err);
        res.status(500).json({ message: 'Error handling ingredients' });
      });
  });
};

exports.getRecipes = (req, res) => {
  const userEmail = req.query.user_email;

  const sql = `
    SELECT 
      r.recipe_id, 
      r.name AS recipe_name, 
      r.description, 
      ri.quantity AS ingredient_quantity,
      i.ingredient_id,
      i.name AS ingredient_name, 
      i.cost, 
      i.calories, 
      i.sodium, 
      i.protein, 
      i.fats, 
      i.sugar, 
      i.carbs, 
      i.allergens
    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
    LEFT JOIN ingredients i 
    ON ri.ingredient_id = i.ingredient_id 
    AND (i.user_email = ? OR i.user_email IS NULL)
    WHERE r.user_email = ?
  `;

  db.query(sql, [userEmail, userEmail], (err, results) => {
    if (err) {
      console.error('Error fetching recipes:', err);
      return res.status(500).json({ message: 'Error fetching recipes' });
    }

    const recipes = results.reduce((acc, row) => {
      if (!acc[row.recipe_id]) {
        acc[row.recipe_id] = {
          recipe_id: row.recipe_id,
          name: row.recipe_name,
          description: row.description,
          ingredients: []
        };
      }

      if (row.ingredient_id) {
        acc[row.recipe_id].ingredients.push({
          ingredient_id: row.ingredient_id,
          name: row.ingredient_name,
          cost: row.cost,
          quantity: row.ingredient_quantity,
          calories: row.calories,
          sodium: row.sodium,
          protein: row.protein,
          fats: row.fats,
          sugar: row.sugar,
          carbs: row.carbs,
          allergens: row.allergens
        });
      }

      return acc;
    }, {});

    res.json(Object.values(recipes));
  });
};
