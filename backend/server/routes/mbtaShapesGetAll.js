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

            if (!routesData) {
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
  
    async getShapesForRoute(routeId) {
        try {
            const response = await axios.get(`${config.baseUrl}/shapes`, {
                params: { 'filter[route]': routeId },
                headers: this.getHeaders()
            });
        
            const shapesData = response.data?.data || [];
            return { routeId: routeId, shapes: shapesData };
        } catch (err) {
            console.error(`Error fetching shapes for route ${routeId}: ${err.message}`);
            return [];
        }
    }
};

const transformers = {
    extractShapeInfo(shape) {
        if (!shape || !shape.id || !shape.attributes || !shape.attributes.polyline) {
            console.warn("Invalid shape data:", shape);
            return null;
        }
        return {
            _id: shape.id,
            routeId: shape.relationships?.route?.data?.id,
            polyline: shape.attributes.polyline
        };
    },
  

    processShapes(routeShapesData) {
        const allProcessedShapes = [];
        const routeShapesMap = {};

        routeShapesData.forEach(dataForRoute => {
            const currentRouteId = dataForRoute.routeId;
            const rawShapesForRoute = dataForRoute.shapes;

            if (!routeShapesMap[currentRouteId]) {
                routeShapesMap[currentRouteId] = [];
            }

            if (dataForRoute.error) {
                console.warn(`Skipping processing for route ${currentRouteId} due to fetch error.`);
                return;
            }

            rawShapesForRoute.forEach(rawShape => {
                const shapeId = rawShape?.id;
                const polyline = rawShape?.attributes?.polyline;

                if (!shapeId || !polyline) {
                    console.warn("Invalid raw shape data (missing id or polyline):", JSON.stringify(rawShape).substring(0, 200));
                    return; // Skip this invalid raw shape
                }

                const shapeInfo = {
                    _id: shapeId,
                    routeId: currentRouteId,
                    polyline: polyline
                };

                allProcessedShapes.push(shapeInfo);

                routeShapesMap[currentRouteId].push(shapeInfo);
            });
        });

        return {
            shapes: allProcessedShapes,
            routeShapes: routeShapesMap
        };
    }
};


router.get('/getAll', async (req, res) => {
    try {
        const routeIds = await mbtaApi.getTrainRoutes();
      
        if (routeIds.length === 0) {
            return res.json({ 
                message: 'No routes found',
                shapes: [],
                routeShapes: {}
            });
        }
      
        const shapePromises = routeIds.map(routeId => 
            mbtaApi.getShapesForRoute(routeId)
        );
      
        const allShapes = await Promise.all(shapePromises);
      
        const shapesData = transformers.processShapes(allShapes);
      
        return res.json(shapesData.routeShapes);
    } catch (error) {
        console.error("Error in /getAll route:", error.message);
        return res.status(500).json({
            message: 'Failed to fetch shape data from external source.',
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;