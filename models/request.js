var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
	requester: String, 
	orderDescription: String,
	orderTime: Date,
	timeFrame: Number,
	requestAccepted: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Request', RequestSchema);
