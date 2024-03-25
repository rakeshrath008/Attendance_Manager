const express = require('express');
const router = express.Router();
const { createTime, lastData, dailyTime } = require('../controllers/timeController');

router.post('/createTime',createTime);
router.get('/:userId/lastData',lastData);
router.get('/:userId/dailyTime',dailyTime)

module.exports = router;