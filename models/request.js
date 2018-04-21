var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
	requester: String, 
	orderDescription: String,
	orderTime: Date,
	endTime: Date,
	requestAccepted: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Request', RequestSchema);