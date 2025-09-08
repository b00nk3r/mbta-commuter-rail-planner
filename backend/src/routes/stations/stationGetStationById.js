const express = require('express');
const router = express.Router();
const stationController = require('../../controllers/stationController');

router.get('/getStationById', stationController.getById);

module.exports = router;