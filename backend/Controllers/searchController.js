const db = require('../config/db');  // Ensure you're using the 'mysql' package

exports.searchIngredient = (req, res) => {
  const { query, filters, email } = req.body;

  const cleanedQuery = query.trim().toLowerCase();

  // First: Get user preferences
  db.query('SELECT preferences FROM Users WHERE email = ?', [email], (err, userResults) => {
    if (err) {
      console.error('Error fetching user preferences:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Parse the JSON preferences
    const preferences = JSON.parse(userResults[0].preferences);
    const preferenceValue = preferences.value;

    console.log('User preference value:', preferenceValue);  // Check if it's correctly parsed

    // Second: Get ingredient ID
    db.query('SELECT ingredient_id FROM Ingredients WHERE LOWER(name) = ?', [cleanedQuery], (err, ingredientResults) => {
      if (err) {
        console.error('Error fetching ingredient:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (ingredientResults.length === 0) {
        return res.json({ success: false, message:  `Ingredient not found: "${query}"`});
      }

      const ingredientId = ingredientResults[0].ingredient_id;

      // Third: Get substitutes based on user preferences and selected filters
      let filterQueries = [];

      if (filters.includes("nutrientBased")) {
        filterQueries.push('criteria = "Low Sugar" OR criteria = "Low Carbohydrates"'); // Example: you can add more nutrient preferences
      }

      if (filters.includes("allergenFree")) {
        filterQueries.push('criteria = "Lactose-Free"');  // Example: Adjust based on your allergen preference field
      }

      if (filters.includes("costBased")) {
        filterQueries.push('criteria = "Cost-Based"');  // Example: Adjust based on your cost-based criteria
      }

      const filterQuery = filterQueries.length > 0 ? filterQueries.join(" OR ") : '1'; // Default to '1' (no filter)

      db.query(
        `SELECT substitute_id FROM Substitution WHERE ingredient_id = ? AND (${filterQuery})`,
        [ingredientId],
        (err, subResults) => {
          if (err) {
            console.error('Error fetching substitutions:', err);
            return res.status(500).json({ error: 'Server error' });
          }

          if (subResults.length === 0) {
            return res.json({ success: true, results: [`No substitutions found for ${query} with selected filters`] });
          }

          const substituteIds = subResults.map(r => r.substitute_id);

          // Fourth: Get substitute names from Ingredients table
          db.query(
            'SELECT name FROM Ingredients WHERE ingredient_id IN (?)',
            [substituteIds],
            (err, namesResults) => {
              if (err) {
                console.error('Error fetching substitute names:', err);
                return res.status(500).json({ error: 'Server error' });
              }

              const formatted = namesResults.map(row =>
                `${query} ➔ substitute: ${row.name} (based on selected filters)`
              );

              res.json({ success: true, results: formatted });
            }
          );
        }
      );
    });
  });
};