const db = require('../config/db');

/*exports.searchIngredient = (req, res) => {
  const { query, filters, email } = req.body;

  if (!query || !filters || !email) {
    return res.status(400).json({ success: false, message: 'Missing input fields.' });
  }

  console.log(`Searching for ingredient: ${query}`);
  console.log(`With filters:`, filters);

  db.query('SELECT ingredient_id FROM ingredients WHERE name = ?', [query], (error, result) => {
    if (error) return res.status(500).json({ success: false, message: 'Database error.' });

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: `Ingredient "${query}" not found.` });
    }

    const ingredientId = result[0].ingredient_id;

    db.query('SELECT preferences FROM user WHERE email = ?', [email], async (error, result1) => {
      if (error) return res.status(500).json({ success: false, message: 'Database error.' });

      let preferences = [];
if (result1 && result1.length > 0 && result1[0].preferences) {
  try {
    preferences = JSON.parse(result1[0].preferences);
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Invalid preferences format.' });
  }
}

      const promises = [];

      for (const filter of filters) {
        let typeToMatch = null;
      
        if (filter === 'costBased' || filter === 'Lower Cost' || filter === 'Low Cost' || filter === 'lower cost' || filter === 'low cost') {
          typeToMatch = 'Lower Cost';
        } else if (filter === 'allergenFree' || filter === 'Allergy') {
          typeToMatch = 'Allergy';
        } else if (filter === 'nutrientBased' || filter === 'Nutrient') {
          typeToMatch = 'Nutrient';
        } else {
          continue; // skip unknown filters
        }
      
        console.log(`Mapped filter "${filter}" to type: ${typeToMatch}`);
      
        if (typeToMatch === 'Lower Cost') {
          // your costBased query
          promises.push(new Promise((resolve, reject) => {
            db.query(
              `SELECT i.name AS substitute_name
               FROM substitutions s
               JOIN ingredients i ON s.substitute_id = i.ingredient_id
               WHERE s.ingredient_id = ? AND s.criteria = 'Lower Cost'`,
              [ingredientId],
              (err, result2) => {
                if (err) return reject(err);
                const subs = result2.map(sub => `[Cost-Based] Substitute: ${sub.substitute_name}`);
                resolve(subs);
              }
            );
          }));
        } else {
          // Allergy or Nutrient
          const matchedPrefs = preferences.filter(p => p.type === typeToMatch);
          for (const pref of matchedPrefs) {
            promises.push(new Promise((resolve, reject) => {
              db.query(
                `SELECT i.name AS substitute_name
                 FROM substitutions s
                 JOIN ingredients i ON s.substitute_id = i.ingredient_id
                 WHERE s.ingredient_id = ? AND s.criteria = ?`,
                [ingredientId, pref.value],
                (err, result3) => {
                  if (err) return reject(err);
                  const subs = result3.map(sub =>
                    `[${typeToMatch}] (${pref.value}) Substitute: ${sub.substitute_name}`
                  );
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
*/
exports.searchIngredient = (req, res) => {
  const { query, filters, email } = req.body;

  if (!query || !filters || !email) {
    return res.status(400).json({ success: false, message: 'Missing input fields.' });
  }

  console.log(`Searching for ingredient: ${query}`);
  console.log(`With filters:`, filters);

  db.query('SELECT ingredient_id FROM ingredients WHERE name = ?', [query], (error, result) => {
    if (error) return res.status(500).json({ success: false, message: 'Database error.' });

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: `Ingredient "${query}" not found.` });
    }

    const ingredientId = result[0].ingredient_id;

    db.query('SELECT preferences FROM user WHERE email = ?', [email], async (error, result1) => {
      if (error) return res.status(500).json({ success: false, message: 'Database error.' });

      let preferences = [];
      if (result1 && result1.length > 0 && result1[0].preferences) {
        try {
          preferences = JSON.parse(result1[0].preferences);
        } catch (e) {
          return res.status(500).json({ success: false, message: 'Invalid preferences format.' });
        }
      }

      const promises = [];

      for (const filter of filters) {
        let typeToMatch = null;

        if (filter === 'costBased' || filter === 'Lower Cost' || filter === 'Low Cost' || filter === 'lower cost' || filter === 'low cost') {
          // Handle cost filter separately
          promises.push(new Promise((resolve, reject) => {
            console.log('Executing Lower Cost filter');
            db.query(
              `SELECT i.name AS substitute_name
               FROM substitutions s
               JOIN ingredients i ON s.substitute_id = i.ingredient_id
               WHERE s.ingredient_id = ? AND s.criteria = 'Lower Cost'`,
              [ingredientId],
              (err, result2) => {
                if (err) return reject(err);
                if (result2.length > 0) {
                  console.log('Found cost-based substitutes:', result2);
                  const subs = result2.map(sub => `[Cost-Based] Substitute: ${sub.substitute_name}`);
                  resolve(subs);
                } else {
                  console.log('No cost-based substitutes found.');
                  resolve([]); // No results, resolve with an empty array
                }
              }
            );
          }));
        } else if (filter === 'allergenFree' || filter === 'Allergy') {
          typeToMatch = 'Allergy';
        } else if (filter === 'nutrientBased' || filter === 'Nutrient') {
          typeToMatch = 'Nutrient';
        } else {
          continue; // skip unknown filters
        }

        if (typeToMatch) {
          console.log(`Mapped filter "${filter}" to type: ${typeToMatch}`);

          // Allergy or Nutrient filters
          const matchedPrefs = preferences.filter(p => p.type === typeToMatch);
          for (const pref of matchedPrefs) {
            promises.push(new Promise((resolve, reject) => {
              db.query(
                `SELECT i.name AS substitute_name
                 FROM substitutions s
                 JOIN ingredients i ON s.substitute_id = i.ingredient_id
                 WHERE s.ingredient_id = ? AND s.criteria = ?`,
                [ingredientId, pref.value],
                (err, result3) => {
                  if (err) return reject(err);
                  const subs = result3.map(sub =>
                    `[${typeToMatch}] (${pref.value}) Substitute: ${sub.substitute_name}`
                  );
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
