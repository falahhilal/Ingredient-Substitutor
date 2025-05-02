/*const express = require('express');
const router = express.Router();
const settingsController = require('../Controllers/settingsController');

router.get('/preferences', settingsController.getUserPreferences);
router.post('/preferences', settingsController.saveUserPreferences);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const settingsController = require('../Controllers/settingsController');

router.get('/preferences', settingsController.getUserPreferences);
router.post('/preferences', settingsController.saveUserPreferences);
router.post('/change-password', settingsController.changePassword);

module.exports = router;