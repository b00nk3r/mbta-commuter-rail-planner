const express = require("express");
const router = express.Router();
const axios = require('axios');

const MBTA_API_BASE_URL = 'https://api-v3.mbta.com';
const MBTA_API_KEY = process.env.MBTA_API_KEY

router.get('/getAll', async (req, res) => {
    try {

        const routesResponse = await axios.get(`${MBTA_API_BASE_URL}/routes`, {
            params: {
                'filter[type]': 2
            },
            headers: { 'x-api-key': MBTA_API_KEY }
        });

        if (!routesResponse.data || !Array.isArray(routesResponse.data.data)) {
            throw new Error("Invalid routes response structure from MBTA API");
         }
        const routeIds = routesResponse.data.data.map(route => route.id);

        const stopPromises = routeIds.map(routeId =>
            axios.get(`${MBTA_API_BASE_URL}/stops`, {
                params: {
                    'filter[route]': routeId
                },
                headers: { 'x-api-key': MBTA_API_KEY }
            }).catch(err => {
                console.error(`Error fetching stops for route ${routeId}: ${err.message}. Skipping this route.`);
                return { data: { data: [] } }; // Return empty data structure on error for this specific route
            })
        );

        const stopResponses = await Promise.all(stopPromises);

        const uniqueStations = new Map();

        stopResponses.forEach(response => {
            if (response && response.data && Array.isArray(response.data.data)) {
                response.data.data.forEach(stop => {
                    // Add station only if it has coordinates and is not already added
                    if (!uniqueStations.has(stop.id) && stop.attributes.latitude && stop.attributes.longitude) {
                        uniqueStations.set(stop.id, {
                            _id: stop.id,
                            stationName: stop.attributes.name,
                            latitude: stop.attributes.latitude,
                            longitude: stop.attributes.longitude,
                        });
                    }
                });
            } else {
                 console.warn("Skipping an invalid or empty stop response during aggregation.");
            }
        });

        const stationsArray = Array.from(uniqueStations.values());
        return res.json(stationsArray);
        
    } catch (error) {
        // Log the error on the server for debugging
        console.error('Error fetching or processing MBTA station data in /station/getAll:', error.message);
        if (error.response) {
            // Log details if it's an error from the Axios request itself
            console.error('MBTA API Error Status:', error.response.status);
            console.error('MBTA API Error Data:', error.response.data);
        }
        // Send a generic error response to the client
        return res.status(500).json({ message: 'Failed to fetch station data from external source.' });
    }
});

module.exports = router;