var mongoose = require('mongoose');

var feedbackSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Moderation Feedback', 'Bug Report', 'Feature Suggestion', 'Board Suggestion'],
    required: true
  },
  subject: { type : String, maxLength: 50, trim: true, required: true },
  message: { type : String, maxLength: 500, trim: true, required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
