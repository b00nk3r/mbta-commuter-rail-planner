const express = require('express');
const router = express.Router();
const stationController = require('../../controllers/stationController');

router.delete('/deleteStationById', stationController.deleteById);

module.exports = router;