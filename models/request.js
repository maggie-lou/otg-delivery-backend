var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
  requester: {type: Schema.Types.ObjectId, ref: 'User'},
	orderStartTime: {type: Date, default: Date.now},
	orderEndTime: {type: Date, default: Date.now},
	status: String,
  deliveryLocationOptions: String,
  deliveryLocation: String,
  diffHelperRequesterArrivalTime: Number,
  helperTextTime: Date,
  requesterTextRespondTime: Date,
  timeProbabilityCondition: String,
  timeProbabilities: String,
  planningNotes: String,
});

module.exports = mongoose.model('Request', RequestSchema);
