/*const express = require('express');
const recipeController = require('../Controllers/recipeController');

const router = express.Router();

router.post('/add', recipeController.addRecipe);
router.get('/list', recipeController.getRecipes);

module.exports = router; */


const express = require('express');
const recipeController = require('../Controllers/recipeController');

const router = express.Router();

// Add new recipe
router.post('/add', recipeController.addRecipe);

// Get recipes for user or all public recipes
router.get('/list', recipeController.getRecipes);

// Rate a recipe
router.post('/rate', recipeController.rateRecipe);

// Get average rating of a recipe
router.get('/ratings', recipeController.getRecipeRatings);

// Search recipes
router.get('/search', recipeController.searchRecipes);

module.exports = router;
