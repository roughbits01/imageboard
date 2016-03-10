var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
  text: { type : String, maxLength: 50, trim: true, required: true },
  done: { type : Boolean, default: false },
  duedate: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);
