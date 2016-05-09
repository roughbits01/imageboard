var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
  tag: { type : String, maxLength: 50, trim: true, required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tag', tagSchema);
