const express = require('express');
const searchController = require('../Controllers/searchController'); // Import the searchController

const router = express.Router();

// Define the route for searching ingredients
router.post('/searchIngredient', searchController.searchIngredient);  // Handle POST requests

module.exports = router;