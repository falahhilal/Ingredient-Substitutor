const db = require('../config/db');

exports.searchIngredient = (req, res) => {
  const { query, filters, email } = req.body;

  if (!query || !filters || !email) {
    return res.status(400).json({ success: false, message: 'Missing input fields.' });
  }

  db.query('SELECT ingredient_id FROM ingredients WHERE name = ?', [query], (error, result) => {
    if (error) return res.status(500).json({ success: false, message: 'Database error.' });

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: `Ingredient "${query}" not found.` });
    }

    const ingredientId = result[0].ingredient_id;

    // ----------- Get user_id + preferences ----------
    db.query('SELECT user_id, preferences FROM user WHERE email = ?', [email], async (error, result1) => {
      if (error) return res.status(500).json({ success: false, message: 'Database error.' });

      if (!result1 || result1.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const userId = result1[0].user_id;

      let preferences = [];
      if (result1[0].preferences) {
        try {
          preferences = JSON.parse(result1[0].preferences);
        } catch (e) {
          return res.status(500).json({ success: false, message: 'Invalid preferences format.' });
        }
      }

      const promises = [];

      for (const filter of filters) {
        let typeToMatch = null;

        // ---------- COST ----------
        if (filter.toLowerCase().includes('low cost')) {
          promises.push(new Promise((resolve, reject) => {
            db.query(
              `SELECT s.substitution_id, i.name AS substitute_name,
                      (SELECT AVG(rating) FROM substitution_activity sa WHERE sa.substitution_id = s.substitution_id) AS avg_rating
               FROM substitutions s
               JOIN ingredients i ON s.substitute_id = i.ingredient_id
               WHERE s.ingredient_id = ? AND s.criteria = 'Lower Cost'`,
              [ingredientId],
              (err, result2) => {
                if (err) return reject(err);

                // LOG activity for each substitution
                result2.forEach(sub => {
                  db.query(
                    `INSERT INTO substitution_activity (user_id, substitution_id)
                     VALUES (?, ?)`,
                    [userId, sub.substitution_id]
                  );
                });

                const subs = result2.map(sub => {
                  const ratingText = sub.avg_rating ? ` (Avg Rating: ${sub.avg_rating.toFixed(1)} ⭐)` : ' (Avg Rating: No ratings yet)';
                  return `[Cost-Based] Substitute: ${sub.substitute_name}${ratingText}`;
                });
                resolve(subs);
              }
            );
          }));
        }

        // ---------- Nutrient / Allergy ----------
        else if (filter === 'Allergy') typeToMatch = 'Allergy';
        else if (filter === 'Nutrient') typeToMatch = 'Nutrient';
        else continue;

        if (typeToMatch) {
          const matchedPrefs = preferences.filter(p => p.type === typeToMatch);

          for (const pref of matchedPrefs) {
            promises.push(new Promise((resolve, reject) => {
              db.query(
                `SELECT s.substitution_id, i.name AS substitute_name,
                        (SELECT AVG(rating) FROM substitution_activity sa WHERE sa.substitution_id = s.substitution_id) AS avg_rating
                 FROM substitutions s
                 JOIN ingredients i ON s.substitute_id = i.ingredient_id
                 WHERE s.ingredient_id = ? AND s.criteria = ?`,
                [ingredientId, pref.value],
                (err, result3) => {
                  if (err) return reject(err);

                  // LOG activity
                  result3.forEach(sub => {
                    db.query(
                      `INSERT INTO substitution_activity (user_id, substitution_id)
                       VALUES (?, ?)`,
                      [userId, sub.substitution_id]
                    );
                  });

                  const subs = result3.map(sub => {
                    const ratingText = sub.avg_rating ? ` (Avg Rating: ${sub.avg_rating.toFixed(1)} )` : ' (Avg Rating: No ratings yet)';
                    return `[${typeToMatch}] (${pref.value}) Substitute: ${sub.substitute_name}${ratingText}`;
                  });
                  resolve(subs);
                }
              );
            }));
          }
        }
      }

      try {
        const allResults = await Promise.all(promises);
        const flattened = allResults.flat();

        if (flattened.length === 0) {
          return res.status(200).json({ success: true, results: ['No matching substitutes found.'] });
        }

        return res.json({ success: true, results: flattened });

      } catch (err) {
        console.error('Query error:', err);
        return res.status(500).json({ success: false, message: 'Error fetching substitutes.' });
      }
    });
  });
};
