const mongoose = require('mongoose');

const lineSchema = new mongoose.Schema({
  mbtaRouteId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  lineColor: {
    type: String,
    required: true,
    match: /^#([0-9A-F]{6}|[0-9A-F]{3})$/i
  },
  shapes: [{
    shapeId: { type: String, required: true },
    directionId: { type: Number, enum: [0, 1] },
    branchName: String
  }]
});

module.exports = mongoose.model('Line', lineSchema);