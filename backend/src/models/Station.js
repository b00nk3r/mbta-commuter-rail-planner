const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  mbtaId: {
      type: String,
      required: true,
      unique: true
  },
  name: {
      type: String,
      required: true
  },
  lines: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Line'
  }],
  coordinates: {
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
    }
  },
  type: {
      type: String,
      enum: ['terminal', 'station'],
      default: 'station'
  },
  imageUrl: String,
  facilities: [String],
  address: String,
  municipality: String
});

stationSchema.index({ coordinates: '2dsphere' });
stationSchema.index({ name: 'text' });

module.exports = mongoose.model('Station', stationSchema);