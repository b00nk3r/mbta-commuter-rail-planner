const express = require('express');
const router = express.Router();
const stationController = require('../../controllers/stationController');

router.get('/getAll', stationController.getAll);

module.exports = router;