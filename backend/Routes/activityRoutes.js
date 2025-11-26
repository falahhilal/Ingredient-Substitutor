
const express = require('express');
const activityController = require('../Controllers/activityController');

const router = express.Router();

router.post('/userActivity', activityController.getUserActivity);
router.post('/rate', activityController.rateActivity);

module.exports = router;
