// Controllers/activityController.js
const db = require('../config/db');

exports.getUserActivity = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Missing email.' });

  // get user_id
  db.query('SELECT user_id FROM user WHERE email = ?', [email], (err, userResult) => {
    if (err) {
      console.error('DB error (get user):', err);
      return res.status(500).json({ success: false, message: 'Database error.' });
    }
    if (!userResult || userResult.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const userId = userResult[0].user_id;

    // get activities for past 3 months
    const query = `
      SELECT 
        sa.id AS activity_id,
        sa.substitution_id,
        sa.created_at,
        sa.rating,
        s.criteria,
        i_sub.name AS substitute_name,
        i_orig.name AS original_name
      FROM substitution_activity sa
      JOIN substitutions s ON sa.substitution_id = s.substitution_id
      JOIN ingredients i_sub ON s.substitute_id = i_sub.ingredient_id
      JOIN ingredients i_orig ON s.ingredient_id = i_orig.ingredient_id
      WHERE sa.user_id = ? AND sa.created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
      ORDER BY sa.created_at DESC
    `;

    db.query(query, [userId], (err2, activityRows) => {
      if (err2) {
        console.error('DB error (get activities):', err2);
        return res.status(500).json({ success: false, message: 'Database error.' });
      }

      // return activity rows directly
      return res.json({ success: true, results: activityRows });
    });
  });
};

exports.rateActivity = (req, res) => {
  const { email, activityId, rating } = req.body;
  if (!email || activityId === undefined || rating === undefined) {
    return res.status(400).json({ success: false, message: 'Missing fields.' });
  }

  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ success: false, message: 'Invalid rating. Must be 1-5.' });
  }

  // verify user owns the activity (
  db.query('SELECT user_id FROM user WHERE email = ?', [email], (err, userResult) => {
    if (err) {
      console.error('DB error (get user):', err);
      return res.status(500).json({ success: false, message: 'Database error.' });
    }
    if (!userResult || userResult.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const userId = userResult[0].user_id;

    db.query('SELECT user_id FROM substitution_activity WHERE id = ?', [activityId], (err2, actResult) => {
      if (err2) {
        console.error('DB error (get activity):', err2);
        return res.status(500).json({ success: false, message: 'Database error.' });
      }
      if (!actResult || actResult.length === 0) {
        return res.status(404).json({ success: false, message: 'Activity not found.' });
      }

      const activityUserId = actResult[0].user_id;
      if (activityUserId !== userId) {
        return res.status(403).json({ success: false, message: 'Forbidden. Activity does not belong to user.' });
      }

      // update rating
      db.query(
        'UPDATE substitution_activity SET rating = ? WHERE id = ?',
        [numericRating, activityId],
        (err3, updateResult) => {
          if (err3) {
            console.error('DB error (update rating):', err3);
            return res.status(500).json({ success: false, message: 'Database error.' });
          }

          return res.json({ success: true, message: 'Rating saved.', rating: numericRating });
        }
      );
    });
  });
};
