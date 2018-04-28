var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
	requester: String,
	orderDescription: String,
	orderTime: Date,
	endTime: Date,
	status: String,
  helper: {
    type: String,
    default: ''
  },
  deliveryLocation: String,
  deliveryLocationDetails: String,
});

module.exports = mongoose.model('Request', RequestSchema);
