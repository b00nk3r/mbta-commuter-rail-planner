const express = require("express");
const router = express.Router();
const station = require('../../models/stationModel')


router.put('/stationUpdateStationById', async (req, res) =>{

    const {id, ...updatedData} = req.body;
    //const updatedData = req.body;

    try {
        // Find the station by ID and update it with the new data
        const updatedStation = await station.findByIdAndUpdate(id, updatedData, {
            new: true,        // Return the updated station, not the original
            runValidators: true // Ensure validation on the updated data
        });

        // If no station is found with that ID, return a 404 error
        if (!updatedStation) {
            return res.status(404).json({ message: "Station not found" });
        }

        // Return the updated station as the response
        return res.json(updatedStation);

    } catch (error) {
        console.error("Error updating station:", error);
        return res.status(500).json({ message: "Server error, unable to update station" });
    }
});

module.exports = router;