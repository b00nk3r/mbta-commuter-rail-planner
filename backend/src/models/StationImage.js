const mongoose = require('mongoose');

const stationImageSchema = new mongoose.Schema(
  {
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
      index: true
    },

    s3Key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    bucket: {
      type: String,
      required: true,
      trim: true
    },

    url: {
      type: String,
      trim: true
    },

    altText: {
      type: String,
      trim: true
    },

    isPrimary: {
      type: Boolean,
      default: false
    },

    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

stationImageSchema.index(
  { station: 1, isPrimary: 1 },
  {
    unique: true,
    partialFilterExpression: { isPrimary: true }
  }
);

module.exports = mongoose.model('StationImage', stationImageSchema);
