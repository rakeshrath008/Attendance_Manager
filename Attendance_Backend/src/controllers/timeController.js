const Time = require('../models/timeModel');

const createTime =  async (req, res) => {
    try {
      const { userId, username, entry, exit } = req.body;
      if (entry) {
        const time = await Time.create({ userId, username, entryTime: new Date() });
        return res.json(time);
      }
      if (exit) {
        const time = await Time.create({ userId, username, exitTime: new Date() });
        return res.json(time);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

const lastData = async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    try {
      const lastData = await Time.findOne({ userId }).sort({ _id: -1 });
      if (lastData) {
        if (lastData.entryTime) {
          res.json({ time: lastData.entryTime, type: 'entry' });
        } else if (lastData.exitTime) {
          res.json({ time: lastData.exitTime, type: 'exit' });
        } else {
          res.json({ error: 'No entry or exit time found' });
        }
      } else {
        res.json({ error: 'No data found' });
      }
    } catch (error) {
      console.error('Error retrieving last time:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  module.exports = {
    createTime,
    lastData,
  }