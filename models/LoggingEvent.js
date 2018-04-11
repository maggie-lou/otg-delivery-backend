var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoggingEventSchema = new Schema({
    username: String, 
    locationEntered: String,
	eventTime: Date,
    requestId: {type: Schema.Types.ObjectId, ref: 'requests'},
    eventType: String
});

module.exports = mongoose.model('LoggingEvent', LoggingEventSchema);