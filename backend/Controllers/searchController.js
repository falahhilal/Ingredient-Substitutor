const db = require('../config/db');

exports.searchIngredient = async (req, res) => {
  const { query, filters, email } = req.body;

  if (!query || !filters || !email) {
    return res.status(400).json({ success: false, message: 'Missing input fields.' });
  }

  try {
    // 1️⃣ Get ingredient
    const ingredientResult = await db.query(
      'SELECT ingredient_id FROM ingredients WHERE name = $1',
      [query]
    );

    if (ingredientResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Ingredient "${query}" not found.`
      });
    }

    const ingredientId = ingredientResult.rows[0].ingredient_id;

    // 2️⃣ Get user + preferences
    const userResult = await db.query(
      'SELECT user_id, preferences FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const userId = userResult.rows[0].user_id;

    let preferences = [];

    if (userResult.rows[0].preferences) {
      if (typeof userResult.rows[0].preferences === "string") {
        // fallback (if stored as text)
        preferences = JSON.parse(userResult.rows[0].preferences);
      } else {
        // correct Postgres JSON behavior
        preferences = userResult.rows[0].preferences;
      }
    }

    const allResults = [];

    // 3️⃣ Process filters
    for (const filter of filters) {

      // ---------- COST ----------
      if (filter.toLowerCase().includes('low cost')) {
        const result2 = await db.query(
          `SELECT s.substitution_id, i.name AS substitute_name,
                  (SELECT AVG(rating)
                   FROM substitution_activity sa
                   WHERE sa.substitution_id = s.substitution_id) AS avg_rating
           FROM substitutions s
           JOIN ingredients i ON s.substitute_id = i.ingredient_id
           WHERE s.ingredient_id = $1 AND s.criteria = 'Lower Cost'`,
          [ingredientId]
        );

        for (const sub of result2.rows) {
          await db.query(
            `INSERT INTO substitution_activity (user_id, substitution_id)
             VALUES ($1, $2)`,
            [userId, sub.substitution_id]
          );

          const ratingText = sub.avg_rating
            ? ` (Avg Rating: ${Number(sub.avg_rating).toFixed(1)} ⭐)`
            : ' (Avg Rating: No ratings yet)';

          allResults.push(`[Cost-Based] Substitute: ${sub.substitute_name}${ratingText}`);
        }
      }

      // ---------- Allergy / Nutrient ----------
      let typeToMatch = null;
      if (filter === 'Allergy') typeToMatch = 'Allergy';
      if (filter === 'Nutrient') typeToMatch = 'Nutrient';

      if (typeToMatch) {
        const matchedPrefs = preferences.filter(p => p.type === typeToMatch);

        for (const pref of matchedPrefs) {
          const result3 = await db.query(
            `SELECT s.substitution_id, i.name AS substitute_name,
                    (SELECT AVG(rating)
                     FROM substitution_activity sa
                     WHERE sa.substitution_id = s.substitution_id) AS avg_rating
             FROM substitutions s
             JOIN ingredients i ON s.substitute_id = i.ingredient_id
             WHERE s.ingredient_id = $1 AND s.criteria = $2`,
            [ingredientId, pref.value]
          );

          for (const sub of result3.rows) {
            await db.query(
              `INSERT INTO substitution_activity (user_id, substitution_id)
               VALUES ($1, $2)`,
              [userId, sub.substitution_id]
            );

            const ratingText = sub.avg_rating
              ? ` (Avg Rating: ${Number(sub.avg_rating).toFixed(1)})`
              : ' (Avg Rating: No ratings yet)';

            allResults.push(
              `[${typeToMatch}] (${pref.value}) Substitute: ${sub.substitute_name}${ratingText}`
            );
          }
        }
      }
    }

    // 4️⃣ Return results
    if (allResults.length === 0) {
      return res.status(200).json({
        success: true,
        results: ['No matching substitutes found.']
      });
    }

    return res.json({ success: true, results: allResults });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching substitutes.'
    });
  }
};