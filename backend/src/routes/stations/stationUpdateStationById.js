const express = require('express');
const router = express.Router();
const stationController = require('../../controllers/stationController');

router.put('/stationUpdateStationById', stationController.updateById);

module.exports = router;