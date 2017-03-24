var mongoose = require('mongoose');

/**
 * It is worth mentioning that most of the data needed to display an action
 * is stored denormalized in the action document, so that speeds things up considerably.
 */
var actionSchema = new mongoose.Schema({
  user: mongoose.Schema.ObjectId,// The user that performed the action.
  content: mongoose.Schema.ObjectId,
  performed: { type: Date, default: Date.now }// The date when the action was performed.
});

module.exports = mongoose.model('Action', actionSchema);
