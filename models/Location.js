var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  name: String,
  latitude: Number,
  longitude: Number,
});

module.exports = mongoose.model('Location', LocationSchema);
