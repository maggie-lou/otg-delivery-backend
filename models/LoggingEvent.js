var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoggingEventSchema = new Schema({
  requesterName: String,
  location: String,
  eventTime: Date,
  eventType: String,
  details: String,
});

module.exports = mongoose.model('LoggingEvent', LoggingEventSchema);
