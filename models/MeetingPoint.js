var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MeetingPointSchema = new Schema({
  latitude: Number,
  longitude: Number,
  radius: Number,
  requestId: String,
  description: String,
  startTime: String,
  endTime: String,
});

module.exports = mongoose.model('MeetingPoint', MeetingPointSchema);
