var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationUpdateSchema = new Schema({
  latitude: Number,
  longitude: Number,
  speed: Number, // (m/s)
  direction: Number, // (degrees, starting north and going clockwise)
  uncertainty: Number, // (m, radius of uncertainty from latitude and longitude)
  timestamp: String,
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('LocationUpdate', LocationUpdateSchema);
