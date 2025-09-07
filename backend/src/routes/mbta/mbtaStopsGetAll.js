const express = require('express');
const router = express.Router();
const { getAllStops } = require('../../controllers/mbtaController');

router.get('/getAll', getAllStops);

module.exports = router;