const { Time, DailyTime } = require('../models/timeModel');

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

  const dailyTime = async (req, res) => {
    const userId = req.params.userId;
    try {
      const times = await Time.find({ userId }).sort({ entryTime: 1, exitTime: 1 });
      const dailyTimes = {};
      
      times.forEach((time) => {
        
        if (time.entryTime) {
          const date = time.entryTime.toISOString().split('T')[0];
          if (!dailyTimes[date]) {
            dailyTimes[date] = { entryTimes: [], exitTimes: [], totalTimes: [] , date };
          }
          const entryTime = new Date(time.entryTime);
          const entryTimeIndian = entryTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
          dailyTimes[date].entryTimes.push(entryTimeIndian);
        }
    
        if (time.exitTime) {
          const date = time.exitTime.toISOString().split('T')[0];
          if (!dailyTimes[date]) {
            dailyTimes[date] = { entryTimes: [], exitTimes: [], totalTimes: [] , date };
          }
          const exitTime = new Date(time.exitTime);
          const exitTimeIndian = exitTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
          dailyTimes[date].exitTimes.push(exitTimeIndian);
        }
      });
      res.json(dailyTimes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
  module.exports = {
    createTime,
    lastData,
    dailyTime
  }