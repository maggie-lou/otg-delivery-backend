var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
	userId: String,
	requestId: String,
	nextLocation: String,
	inconvenience: String,
	disruption: String,
	waiting: String,
});

module.exports = mongoose.model('Feedback', FeedbackSchema);