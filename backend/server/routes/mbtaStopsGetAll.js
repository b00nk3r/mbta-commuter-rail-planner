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
  
    async getTrainRoutes() {
        try {
            const response = await axios.get(`${config.baseUrl}/routes`, {
                params: { 'filter[type]': 2 }, // Type 2 represents Commuter Rail routes
                headers: this.getHeaders()
            });

            const routesData = response.data?.data;

            if (routesData === null || routesData === undefined) {
                throw new Error("The MBTA API response did not provide any route data.");
            }
            
            if (!Array.isArray(routesData)) {
                throw new Error("The MBTA API did not return a valid array of routes.");
            }
            
            const routeIds = routesData.map(route => route.id);
            return routeIds;
        } catch (err) {
            console.error(`Error fetching train routes: ${err.message}`);
            return [];
        }
    },
  
    async getStopsForRoute(routeId) {
        try {
            const response = await axios.get(`${config.baseUrl}/stops`, {
                params: { 'filter[route]': routeId },
                headers: this.getHeaders()
            });
        
            const stopsData = response.data?.data || [];
            return stopsData;
        } catch (err) {
            console.error(`Error fetching stops for route ${routeId}: ${err.message}`);
            return [];
        }
    }
};

const transformers = {
    extractBasicInfo(stop) {
        return {
            _id: stop.id,
            stationName: stop.attributes.name,
            latitude: stop.attributes.latitude,
            longitude: stop.attributes.longitude
        };
    },
    
    deduplicate(stops) {
        const uniqueStops = new Map();
      
        stops.flat().forEach(stop => {
            if (stop != null && !uniqueStops.has(stop.id)) {
                const stopInfo = transformers.extractBasicInfo(stop);
                if (stopInfo != null) {
                    uniqueStops.set(stop.id, stopInfo);
                }
            }
        });

        return Array.from(uniqueStops.values());
    }
};
  
router.get('/getAll', async (req, res) => {
    try {
        const routeIds = await mbtaApi.getTrainRoutes();
      
      
        const stopPromises = routeIds.map(routeId => 
            mbtaApi.getStopsForRoute(routeId)
        );
        const allStops = await Promise.all(stopPromises);
      
      
        const stopsInfo = transformers.deduplicate(allStops);
      
        return res.json(stopsInfo);
    } catch (error) {
      
        return res.status(500).json({ 
            message: 'Failed to fetch station data from external source.' 
        });
    }
});
  
module.exports = router;