var mongoose = require('mongoose');

var threadSchema = new mongoose.Schema({
  title: { type : String, maxLength: 50, trim: true, required: true },
  replies: Number,
  views: Number,
  created: { type: Date, default: Date.now },
  board: { type : String }
});

module.exports = mongoose.model('Thread', threadSchema);
