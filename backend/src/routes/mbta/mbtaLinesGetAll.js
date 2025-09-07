const express = require('express');
const router = express.Router();
const { getAllLines } = require('../../controllers/mbtaController');

router.get('/getAll', getAllLines);

module.exports = router;