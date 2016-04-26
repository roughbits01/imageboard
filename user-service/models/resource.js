var mongoose = require('mongoose');

var resourceSchema = new mongoose.Schema({
	name: String,
	type: { type: String, enum: ['JPEG','PNG', 'GIF', 'WEBM'] },
	size: Number,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
