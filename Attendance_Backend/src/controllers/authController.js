const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { hashPassword } = require('../utils/passwordUtils');
const secretKey = 'nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAri9QNusRxGP6KN20UUpV';
const registerUser = async (req, res) => {
  try {
    const { email, empId, username, password, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { empId }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with the same email, empId, or username already exists' });
    }
    const hashedPassword = await hashPassword(password);
    const user = new User({ email, empId, username, password: hashedPassword, role, status: 'Active' });
    const doc = await user.save();
    res.json(doc);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const generateToken = (userId, username) => {
  return jwt.sign({ userId, username }, secretKey, { expiresIn: '6h' });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
console.log(req.body);
  try {
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'Inactive') {
      return res.status(401).json({ message: 'Please contact your admin and activate your account.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.username);
    res.json({ token, username: user.username, userId: user._id , role: user.role});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
