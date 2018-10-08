var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: String,
  price: Number,
  location: {type: Schema.Types.ObjectId, ref: 'Location'},
  description: String,
});

module.exports = mongoose.model('Item', ItemSchema);
