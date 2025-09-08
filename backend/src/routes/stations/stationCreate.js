const express = require('express');
const router = express.Router();
const stationController = require('../../controllers/stationController');

router.post('/stations', stationController.create);

module.exports = router;