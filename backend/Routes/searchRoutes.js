const express = require('express');
const searchController = require('../Controllers/searchController'); 

const router = express.Router();

router.post('/searchIngredient', searchController.searchIngredient);  

module.exports = router;