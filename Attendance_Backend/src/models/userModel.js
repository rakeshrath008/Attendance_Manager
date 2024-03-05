const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  empId: Number,
  username: String,
  password: String,
  role: String,
  status: String,
});

module.exports = mongoose.model('User', userSchema);
