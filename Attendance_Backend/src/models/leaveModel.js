const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  date: { type: Date },
  details: { type: String },
});

module.exports = mongoose.model('Leave', leaveSchema);
