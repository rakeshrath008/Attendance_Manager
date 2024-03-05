const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const data = await User.find();

    const responseData = data.map(user => {
      return {
        Email: user.email,
        Employee_ID: user.empId,
        Username: user.username,
        Status: user.status,
        userId:user._id
      };
    });

    res.json(responseData);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    await user.save();

    res.json({ message: 'User status toggled successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  getUsers
};
