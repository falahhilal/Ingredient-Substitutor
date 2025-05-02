const db = require('../config/db');

/*exports.searchIngredient = (req, res) => {
  const { query, filters, email } = req.body;

  if (!query || !filters || !email) {
    return res.status(400).json({ success: false, message: 'Missing input fields.' });
  }

  // Log the incoming data
  console.log(`Searching for ingredient: ${query}`);
  console.log(`With filters:`, filters);

  // Find the ingredient by name
  console.log('Searching for ingredient:', query);
  db.query('SELECT ingredient_id FROM ingredients WHERE name = ?', [query], (error, result) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ success: false, message: 'Database query error.' });
    }

    const ingredientRows = result; // or `result.rows` depending on the library

    // Log the query result
    console.log('Ingredient query result:', ingredientRows);

    // Check if ingredient is found
    if (!ingredientRows || ingredientRows.length === 0) {
      console.log(`Ingredient "${query}" not found in the database.`);
      return res.status(404).json({ success: false, message: `Ingredient "${query}" not found.` });
    }

    const ingredientId = ingredientRows[0].ingredient_id;
    console.log(`Ingredient found with ID: ${ingredientId}`);

    // Get user preferences from the user table
    db.query('SELECT preferences FROM user WHERE email = ?', [email], (error, result1) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ success: false, message: 'Database query error.' });
      }

      const userRows = result1; // or `result.rows` depending on the library

      console.log(`User preferences for ${email}:`, userRows);

      if (userRows.length === 0 || !userRows[0].preferences) {
        console.log(`No preferences found for user ${email}.`);
        return res.status(404).json({ success: false, message: 'User or preferences not found.' });
      }

      let preferences;
      try {
        preferences = JSON.parse(userRows[0].preferences);
        console.log('Parsed preferences:', preferences);
      } catch (err) {
        console.log('Error parsing preferences:', err);
        return res.status(500).json({ success: false, message: 'Invalid preferences format in DB.' });
      }

      // Process filters and search for substitutions
      const results = [];
      for (const filter of filters) {
        let typeToMatch = null;
        if (filter === 'allergenFree') typeToMatch = 'Allergy';
        else if (filter === 'nutrientBased') typeToMatch = 'Nutrient';
        else if (filter === 'costBased') typeToMatch = 'Lower Cost';

        if (!typeToMatch) continue;

        console.log(`Processing filter: ${filter} with type: ${typeToMatch}`);

        if (typeToMatch === 'Lower Cost') {
          db.query(
            `SELECT i.name AS substitute_name 
             FROM substitutions s 
             JOIN ingredients i ON s.substitute_id = i.ingredient_id 
             WHERE s.ingredient_id = ? AND s.criteria = 'Lower Cost'`,
            [ingredientId],
            (error, result2) => {
              if (error) {
                console.error('Database query error:', error);
                return res.status(500).json({ success: false, message: 'Database query error.' });
              }

              const subs = result2; 
              console.log('Query result for cost-based subs:', subs);

              if (Array.isArray(subs)) {
                subs.forEach(sub => {
                  results.push(`[Cost-Based] Substitute: ${sub.substitute_name}`);
                });
              } else {
                console.error('Expected an array but got:', subs);
              }
            }
          );
        } else {
          const matchedPrefs = preferences.filter(p => p.type === typeToMatch);

          for (const pref of matchedPrefs) {
            db.query(
              `SELECT i.name AS substitute_name 
               FROM substitutions s 
               JOIN ingredients i ON s.substitute_id = i.ingredient_id 
               WHERE s.ingredient_id = ? AND s.criteria = ?`,
              [ingredientId, pref.value],
              (error, result3) => {
                if (error) {
                  console.error('Database query error:', error);
                  return res.status(500).json({ success: false, message: 'Database query error.' });
                }

                const subs = result3; 
                console.log(`Query result for ${typeToMatch} subs:`, subs);

                if (Array.isArray(subs)) {
                  subs.forEach(sub => {
                    results.push(`[${typeToMatch}] (${pref.value}) Substitute: ${sub.substitute_name}`);
                  });
                } else {
                  console.error('Expected an array but got:', subs);
                }
              }
            );
          }
        }
      }

      if (results.length === 0) {
        console.log('No matching substitutes found.');
        return res.status(200).json({ success: true, results: ['No matching substitutes found.'] });
      }

      console.log('Substitute results:', results);
      res.json({ success: true, results });
    });
  });
};*/

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
      
        if (filter === 'costBased' || filter === 'Lower Cost') {
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
