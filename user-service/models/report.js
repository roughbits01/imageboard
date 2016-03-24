var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
  ip: String,
  reason: String,
  content: mongoose.Schema.ObjectId,
  text: { type : String, maxLength: 50, trim: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', reportSchema);
