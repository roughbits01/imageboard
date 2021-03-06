var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
  name: { type : String, maxLength: 15, trim: true, required: true, unique: true },
  description: { type : String, maxLength: 500, trim: true, required: true },
  rules: { type : String, maxLength: 1000, trim: true },
  moderators: [{id: String, parent: Number}],
  created: { type: Date, default: Date.now },
  __v: { type: Number, select: false} // Hide version property.
});

module.exports = mongoose.model('Board', boardSchema);
