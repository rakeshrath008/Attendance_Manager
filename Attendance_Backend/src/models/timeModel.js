const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
  userId: String,
  username: String,
  entryTime: { type: Date },
  exitTime: { type: Date },
});

module.exports = mongoose.model('Time', timeSchema);
