const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const newStationModel = require('../models/stationModel');

router.get("/getStationById", async (req, res) => {
  var { stationId } = req.body;

  newStationModel.findById(stationId, function (err, station) {
    if (err) {
      console.log(err);
    }
    if (station ==null) {
      res.status(404).send("StationId does not exist.");
    } 
    else {
      return res.json(station);
    }
  });
});

module.exports = router;