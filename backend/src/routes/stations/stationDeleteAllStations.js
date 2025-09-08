const express = require('express');
const router = express.Router();
const stationController = require('../../controllers/stationController');

router.post('/deleteAll', stationController.deleteAll);

module.exports = router;