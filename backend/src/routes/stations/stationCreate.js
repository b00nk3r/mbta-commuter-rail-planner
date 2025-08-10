const express = require('express');
const router = express.Router();
const newStationModel = require('../../models/stationModel');
const mongoose = require('mongoose');

router.post('/stations', async (req, res) => {
  const { stationName, city, stationLine, stationPic } = req.body;
  
  try {
    // Create the station
    const createNewStation = newStationModel({
      stationName: stationName,
      city: city,
      stationLine: stationLine,
      stationPic: stationPic || "",
    });
    
    // Save the station
    await newStationModel.create(createNewStation);
    
    // Respond with success message
    res.json({
      msg: 'Station created successfully',
      station: createNewStation
    });
  } catch (err) {
    console.error('Error creating station:', err);
    res.status(500).json({ error: 'Could not create station' });
  }
});

module.exports = router;