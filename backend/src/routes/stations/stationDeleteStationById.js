const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const newStationModel = require("../../models/stationModel");

router.delete("/deleteStationById", async (req, res) => {
  const { stationId } = req.body;

  if (!stationId) {
    return res.status(400).send("StationId is required.");
  }

  try {
    const deletedStation = await newStationModel.findByIdAndDelete(stationId);
    
    if (!deletedStation) {
      return res.status(404).send("StationId does not exist.");
    }
    
    res.status(200).json({ message: "Station deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
