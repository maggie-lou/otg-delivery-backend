var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
  requester: {type: Schema.Types.ObjectId, ref: 'User'},
	orderStartTime: {type: Date, default: Date.now},
	orderEndTime: {type: Date, default: Date.now},
  item: String,
	status: String,
  deliveryLocationOptions: String,
  deliveryLocation: String,
  diffHelperRequesterArrivalTime: Number,
  helperTextTime: Date,
  requesterTextRespondTime: Date,
  timeProbabilities: String,
  planningNotes: String,
  pickupLocation: String,
});

module.exports = mongoose.model('Request', RequestSchema);
