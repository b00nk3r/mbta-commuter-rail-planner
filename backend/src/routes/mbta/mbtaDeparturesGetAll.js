const express = require('express');
const router = express.Router();
const { getAllDepartures } = require('../../controllers/mbtaController');

router.get('/getAll', getAllDepartures);

module.exports = router;