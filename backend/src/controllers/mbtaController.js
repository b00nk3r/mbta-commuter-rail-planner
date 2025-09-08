const asyncHandler = require('../middleware/asyncHandler');
const mbtaService = require('../services/mbtaService');

const getAllStops = asyncHandler(async (req, res) => {
  const stops = await mbtaService.listStops();
  res.json(stops);
});

const getAllLines = asyncHandler(async (req, res) => {
  const lines = await mbtaService.listLines();
  res.json(lines);
});

const getAllShapes = asyncHandler(async (req, res) => {
  const shapesByRoute = await mbtaService.listShapesByRoute();
  res.json(shapesByRoute);
});

const getAllDepartures = asyncHandler(async (req, res) => {
  const { origin, line } = req.query;
  if (!origin || !line) return res.status(400).json({ message: 'Missing origin parameter.' });
  const departures = await mbtaService.getDepartures(origin, line);
  res.json(departures);
});

module.exports = { getAllStops, getAllLines, getAllShapes, getAllDepartures };