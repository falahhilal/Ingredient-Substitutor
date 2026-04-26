const express = require('express');
const router = express.Router();
const settingsController = require('../Controllers/settingsController');

router.post('/', settingsController.saveUserPreferences);
router.get('/', settingsController.getUserPreferences);
router.post('/change-password', settingsController.changePassword);

module.exports = router;