var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	text: { type : String, maxLength: 200, trim: true, required: true },
  image: String,
  votes: { type : Number },
  created: { type: Date, default: Date.now },
  thread: mongoose.Schema.ObjectId,
	__v: { type: Number, select: false} // Hide version property.
});

module.exports = mongoose.model('Post', postSchema);
