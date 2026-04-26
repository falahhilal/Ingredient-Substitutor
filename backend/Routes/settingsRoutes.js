
const express = require('express');
const router = express.Router();
const settingsController = require('../Controllers/settingsController');

router.post('/', saveUserPreferences);
router.get('/', getUserPreferences);
router.post('/change-password', settingsController.changePassword);

module.exports = router;