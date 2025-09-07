const express = require('express');
const router = express.Router();
const { getAllShapes } = require('../../controllers/mbtaController');

router.get('/getAll', getAllShapes);

module.exports = router;