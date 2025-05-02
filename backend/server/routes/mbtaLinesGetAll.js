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

    // Fetch line IDs for commuter rail
    async getTrainLines() {
        try {
            const response = await axios.get(`${config.baseUrl}/routes`, {
                params: { 'filter[type]': 2 },
                headers: this.getHeaders()
            });

            const linesData = response.data?.data;

            if (!linesData || !Array.isArray(linesData)) {
                throw new Error("The MBTA API response did not return valid commuter rail line data.");
            }

            // Return an array of line IDs
            const lineIds = linesData.map(route => route.id);
            return lineIds;
        } catch (err) {
            console.error(`Error fetching commuter rail lines: ${err.message}`);
            if (err.response) {
                console.error('API Response:', err.response.data);
            } else if (err.request) {
                console.error('API Request was made but no response:', err.request);
            }
            throw err;
        }
    },

    // Fetch detailed information for each line ID
    async getLineDetails(lineId) {
        try {
            const response = await axios.get(`${config.baseUrl}/routes/${lineId}`, {
                headers: this.getHeaders()
            });

            const lineData = response.data?.data;

            if (!lineData) {
                throw new Error(`No data found for line ID: ${lineId}`);
            }

            return lineData;
        } catch (err) {
            console.error(`Error fetching details for line ${lineId}: ${err.message}`);
            throw err;
        }
    }
};

// Transformer to extract necessary information
const transformers = {
    extractBasicInfo(line) {
        return {
            _id: line.id,
            lineName: line.attributes.long_name,
        };
    },

    // Deduplicate the list of lines based on line ID
    deduplicate(lines) {
        const uniqueLines = new Map();
        lines.forEach(line => {
            if (line != null && !uniqueLines.has(line.id)) {
                const lineInfo = transformers.extractBasicInfo(line);
                uniqueLines.set(line.id, lineInfo);
            }
        });
        return Array.from(uniqueLines.values());
    }
};

// Adjusted getAll route to fetch all lines and their stops
router.get('/getAll', async (req, res) => {
    try {
        // Step 1: Fetch the line IDs
        const lineIds = await mbtaApi.getTrainLines();
        console.log("Fetched Line IDs:", lineIds);

        if (lineIds.length === 0) {
            return res.status(404).json({ message: 'No commuter rail lines found.' });
        }

        // Step 2: Fetch detailed data for each line (in parallel)
        const linePromises = lineIds.map(lineId => mbtaApi.getLineDetails(lineId));
        const allLines = await Promise.all(linePromises);

        // Step 3: Deduplicate the fetched lines and return the result
        const linesInfo = transformers.deduplicate(allLines);
        return res.json(linesInfo);
    } catch (error) {
        console.error("Error in /getAll route:", error.message);
        return res.status(500).json({
            message: 'Failed to fetch station data from external source.',
            error: error.message
        });
    }
});

module.exports = router;
