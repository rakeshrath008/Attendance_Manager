const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
  userId: String,
  username: String,
  entryTime: { type: Date },
  exitTime: { type: Date },
});

const dailyTimeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  entryTime: {
    type: Date,
    required: true
  },
  exitTime: {
    type: Date,
    required: true
  }
});

const Time = mongoose.model('Time', timeSchema);
const DailyTime = mongoose.model('DailyTime', dailyTimeSchema);

module.exports = { Time, DailyTime };
