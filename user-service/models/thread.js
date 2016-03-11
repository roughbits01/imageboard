var mongoose = require('mongoose');

var threadSchema = new mongoose.Schema({
  title: { type : String, maxLength: 50, trim: true, required: true },
  replies: Number,
  views: Number,
  created: { type: Date, default: Date.now },
  board: { type : String },
  __v: { type: Number, select: false} // Hide version property.
});

module.exports = mongoose.model('Thread', threadSchema);
