
const express = require('express');
const activityController = require('../Controllers/activityController');

const router = express.Router();

router.get('/userActivity', activityController.getUserActivity);
router.post('/rate', activityController.rateActivity);

module.exports = router;
