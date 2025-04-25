const express = require("express");
const router = express.Router();
const axios = require('axios');

const config = {
    baseUrl: 'https://api-v3.mbta.com',
    apiKey: process.env.MBTA_API_KEY
};

const mbtaApi = {
    getHeaders() {
        return { 'x-api-key': config.apiKey };
    },

    async getTrainLines() {
        try {
            const response = await axios.get(`${config.baseUrl}/routes`, {
                params: { 'filter[type]': 2 }, // Correct the query string format
                headers: this.getHeaders()
            });

            const linesData = response.data?.data;

            if (!linesData || !Array.isArray(linesData)) {
                throw new Error("The MBTA API response did not return valid commuter rail line data.");
            }

            return linesData.map(line => line.id); // Return line IDs
        } catch (err) {
            console.error(`Error fetching commuter rail lines: ${err.message}`);
            // Log full error details for debugging
            if (err.response) {
                console.error('API Response:', err.response.data);
            } else if (err.request) {
                console.error('API Request was made but no response:', err.request);
            }
            throw err; // Re-throw to be caught in the route handler
        }
    },

};

// Adjusted getAll route to fetch all lines and their stops
router.get('/getAll', async (req, res) => {
    try {
        const lineIds = await mbtaApi.getTrainLines();
        console.log("API Response Data:", lineIds);

        if (lineIds.length === 0) {
            return res.status(404).json({ message: 'No commuter rail lines found.' });
        }

        // Send the data back as a successful response
        return res.status(200).json({ lineIds });

    } catch (error) {
        console.error("Error in /getAll route:", error.message);
        return res.status(500).json({
            message: 'Failed to fetch station data from external source.',
            error: error.message // Include the actual error message in the response
        });
    }
});

module.exports = router;
