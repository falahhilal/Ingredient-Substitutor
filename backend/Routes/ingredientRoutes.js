const express = require('express');
const ingredientController = require('../Controllers/ingredientController');

const router = express.Router();

router.post('/add', ingredientController.addIngredient);
router.get('/list', ingredientController.getIngredients);

module.exports = router;
