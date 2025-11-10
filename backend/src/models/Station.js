const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  mbtaId: {
      type: String,
      required: true,
      unique: true,
      trim: true
  },
  name: {
      type: String,
      required: true,
      trim: true
  },
  lines: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Line'
  }],
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
        type: Number,
        required: true,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
    }
  },
  type: {
      type: String,
      enum: ['terminal', 'station'],
      default: 'station'
  },
  imageUrl: {
    type: String,
    trim: true
  },
  facilities: [String],
  address: {
    type: String,
    trim: true
  },
  mmunicipality: {
    type: String,
    trim: true
  }
});

stationSchema.index({ mbtaId: 1 }, { unique: true });
stationSchema.index({ coordinates: '2dsphere' });
stationSchema.index({ name: 'text' });

module.exports = mongoose.model('Station', stationSchema);