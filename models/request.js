var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
  requester: {type: Schema.Types.ObjectId, ref: 'User'},
  helper: {type: Schema.Types.ObjectId, ref: 'User'},
	orderStartTime: {type: Date, default: Date.now},
	orderEndTime: {type: Date, default: Date.now},
  item: String,
	status: String,
  meetingPoint: String,
  diffHelperRequesterArrivalTime: Number,
  helperTextTime: Date,
  requesterTextRespondTime: Date,
  timeProbabilities: String,
  planningNotes: String,
  pickupLocation: String,
  price: String,
});

module.exports = mongoose.model('Request', RequestSchema);
