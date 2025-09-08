const asyncHandler = require('../middleware/asyncHandler');
const stationService = require('../services/stationService');

const create = asyncHandler(async (req, res) => {
  const { stationName, city, stationLine, stationPic } = req.body;
  const station = await stationService.createStation({ stationName, city, stationLine, stationPic });
  res.json({ msg: 'Station created successfully', station });
});

const getAll = asyncHandler(async (req, res) => {
  const stations = await stationService.findAllStations();
  res.json(stations);
});

const getById = asyncHandler(async (req, res) => {
  const { stationId } = req.body; // preserving current behavior
  const station = await stationService.findStationById(stationId);
  if (!station) return res.status(404).send('StationId does not exist.');
  res.json(station);
});

const updateById = asyncHandler(async (req, res) => {
  const { id, ...updatedData } = req.body;
  const updated = await stationService.updateStationById(id, updatedData);
  if (!updated) return res.status(404).json({ message: 'Station not found' });
  res.json(updated);
});

const deleteById = asyncHandler(async (req, res) => {
  const { stationId } = req.body;
  const deleted = await stationService.deleteStationById(stationId);
  if (!deleted) return res.status(404).send('StationId does not exist.');
  res.status(200).json({ message: 'Station deleted successfully.' });
});

const deleteAll = asyncHandler(async (req, res) => {
  const result = await stationService.deleteAllStations();
  res.json(result);
});

module.exports = { create, getAll, getById, updateById, deleteById, deleteAll };