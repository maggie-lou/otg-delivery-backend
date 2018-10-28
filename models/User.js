var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    deviceId: String,
    username: String,
    phoneNumber: String,
});

module.exports = mongoose.model('User', UserSchema);
