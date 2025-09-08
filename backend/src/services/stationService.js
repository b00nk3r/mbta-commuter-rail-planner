const Station = require('../models/stationModel');

async function createStation({ stationName, city, stationLine, stationPic }) {
  const doc = new Station({
    stationName,
    city,
    stationLine,
    stationPic: stationPic || ''
  });
  return Station.create(doc);
}

function findAllStations() {
  return Station.find();
}

function findStationById(id) {
  return Station.findById(id);
}

function updateStationById(id, updatedData) {
  return Station.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
}

function deleteStationById(id) {
  return Station.findByIdAndDelete(id);
}

function deleteAllStations() {
  return Station.deleteMany();
}

module.exports = {
  createStation,
  findAllStations,
  findStationById,
  updateStationById,
  deleteStationById,
  deleteAllStations
};