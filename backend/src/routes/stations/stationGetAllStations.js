const express = require("express");
const router = express.Router();
const newStationModel = require('../../models/stationModel')

router.get('/getAll', async (req, res) => {
    const station = await newStationModel.find();
    return res.json(station)
  })

  module.exports = router;