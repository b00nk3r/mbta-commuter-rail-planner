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

    async getDepartures(origin, line) {
        try {
            const response = await axios.get(`${config.baseUrl}/schedules`, {
                params: {
                    'filter[stop]': origin,
                    'filter[route]': line,
                    'filter[route_type]': 2, // Commuter rail
                    'sort': 'departure_time' // Ensure results are ordered
                },
                headers: this.getHeaders()
            });

            const departuresData = response.data?.data;

            if (!departuresData || !Array.isArray(departuresData)) {
                throw new Error(`No departures found for ${origin} to ${destination}.`);
            }

            // Extract departure times
            return departuresData.map(schedule => ({
                departure_time: schedule.attributes.departure_time,
                train_number: schedule.relationships.trip.data.id,
                route_id: schedule.relationships.route.data.id
            }));
        } catch (err) {
            console.error(`Error fetching departures: ${err.message}`);
            throw err;
        }
    }
};

router.get('/getAll', async (req, res) => {
    try {
        const {origin, line} = req.query;

        if (!origin || !line) {
            return res.status(400).json({ message: "Missing origin parameter." });
        }

        const response = await axios.get(`${config.baseUrl}/schedules`, {
            params: {
                'filter[stop]': origin,
                'filter[route]': line,
                'filter[route_type]': 2,
                'sort': 'departure_time'
            },
            headers: mbtaApi.getHeaders()
        });

        const departures = response.data?.data.map(schedule => ({
            departure_time: schedule.attributes.departure_time,
            train_number: schedule.relationships.trip.data.id,
            route_id: schedule.relationships.route.data.id
        }));

        return res.json(departures);
    } catch (error) {
        console.error("Error fetching departures:", error.message);
        return res.status(500).json({ message: "Failed to fetch departure times.", error: error.message });
    }
});

module.exports = router;