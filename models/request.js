var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
	requester: String, 
	orderDescription: String,
	orderTime: Date,
	timeFrame: Number
});

module.exports = mongoose.model('Request', RequestSchema);
