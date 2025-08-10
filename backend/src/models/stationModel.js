const mongoose = require("mongoose");

const newStationSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: true,
      label: "stationName",
    },
    city: {
      type: String,
      required: true,
      label: "stationCity",
    },
    stationLine: {
      type: String,
      required: true,
      label: "stationLine"
    },
    stationPic: {
      type: String,
      default:"",
    },
  },
  { collection: "stations" }
);

module.exports = mongoose.model('stations', newStationSchema)