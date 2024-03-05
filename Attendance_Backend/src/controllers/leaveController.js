const Leave = require('../models/leaveModel');

const addLeave = async (req, res) => {
  try {
    const leave = new Leave({
      date: req.body.date,
      details: req.body.details,
    });
    await leave.save();
    res.status(201).json({ message: 'Leave added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteLeave = async (req, res) => {
  console.log(req.body);
  try {
    const date = new Date(parseInt(req.params.date));
    await Leave.deleteOne({ date });
    res.json({ message: 'Leave deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getLeave = async(req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
    console.log(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addLeave,
  deleteLeave,
  getLeave
};
