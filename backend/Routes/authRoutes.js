const express = require('express');
const authController = require('../Controllers/authController');
/*const { signup, login } = require('../Controllers/authController'); */
const router = express.Router();

//Signup Route
router.post('/signup', authController.signup);

//Login Route 
router.post('/login', authController.login);



module.exports = router;

/*
router.post('/signup', signup); */