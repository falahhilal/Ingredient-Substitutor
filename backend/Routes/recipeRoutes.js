const express = require('express');
const recipeController = require('../Controllers/recipeController');

const router = express.Router();

router.post('/add', recipeController.addRecipe);
router.get('/list', recipeController.getRecipes);

module.exports = router;