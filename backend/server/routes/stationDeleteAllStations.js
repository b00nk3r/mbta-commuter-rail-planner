const express = require('express');
const router = express.Router();
const newStationModel = require('../models/stationModel');
const mongoose = require('mongoose');

router.post('/deleteAll', async (req, res) => {
    const stations = await newStationModel.deleteMany();
    return res.json(stations);
});

  module.exports = router;