var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MeetingPointSchema = new Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  requestId: String,
});

module.exports = mongoose.model('MeetingPoint', MeetingPointSchema);
