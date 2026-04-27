const db = require('../config/db');

// ✅ GET USER ACTIVITY
exports.getUserActivity = async (req, res) => {
  const email = req.body.email || req.query.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Missing email.'
    });
  }

  try {
    // Get user_id
    const userResult = await db.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const userId = userResult.rows[0].user_id;

    // Get activity (Postgres interval syntax ✅)
    const activityRows = await db.query(`
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
      WHERE sa.user_id = $1
        AND sa.created_at >= NOW() - INTERVAL '3 months'
      ORDER BY sa.created_at DESC
    `, [userId]);

    return res.json({
      success: true,
      results: activityRows.rows
    });

  } catch (err) {
    console.error('Error fetching activity:', err);
    return res.status(500).json({
      success: false,
      message: 'Database error.'
    });
  }
};


// ✅ RATE ACTIVITY (IMPORTANT — YOU WERE MISSING THIS)
exports.rateActivity = async (req, res) => {
  const { email, activityId, rating } = req.body;

  if (!email || !activityId || !rating) {
    return res.status(400).json({
      success: false,
      message: 'Missing fields.'
    });
  }

  const numericRating = parseInt(rating, 10);

  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5.'
    });
  }

  try {
    // Get user
    const userResult = await db.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const userId = userResult.rows[0].user_id;

    // Check activity ownership
    const activityResult = await db.query(
      'SELECT user_id FROM substitution_activity WHERE id = $1',
      [activityId]
    );

    if (activityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found.'
      });
    }

    if (activityResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    // Update rating (Postgres uses separate params ✅)
    await db.query(
      'UPDATE substitution_activity SET rating = $1 WHERE id = $2',
      [numericRating, activityId]
    );

    return res.json({
      success: true,
      message: 'Rating saved.',
      rating: numericRating
    });

  } catch (err) {
    console.error('Error rating activity:', err);
    return res.status(500).json({
      success: false,
      message: 'Database error.'
    });
  }
};