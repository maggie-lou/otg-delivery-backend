var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
  requester: {type: Schema.Types.ObjectId, ref: 'User'},
  helper: {type: Schema.Types.ObjectId, ref: 'User'},
	orderDescription: String,
	orderTime: {type: Date, default: Date.now},
	endTime: Date,
	status: String,
  deliveryLocation: String,
  deliveryLocationDetails: String,
});

module.exports = mongoose.model('Request', RequestSchema);