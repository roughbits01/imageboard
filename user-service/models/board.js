var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
  name: { type : String, maxLength: 15, trim: true, required: true, unique: true },
  description: { type : String, maxLength: 500, trim: true, required: true },
  created: { type: Date, default: Date.now },
  __v: { type: Number, select: false} // Hide version property.
});

module.exports = mongoose.model('Board', boardSchema);
