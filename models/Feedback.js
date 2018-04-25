var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
	feedbackText: String
});

module.exports = mongoose.model('Feedback', FeedbackSchema);