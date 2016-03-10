var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  title: { type : String, maxLength: 50, trim: true, required: true },
	text: { type : String, maxLength: 200, trim: true, required: true },
  votes: { type : Number },
  created: { type: Date, default: Date.now },
  image: String,
  thread: mongoose.Schema.ObjectId
});

module.exports = mongoose.model('Post', postSchema);
