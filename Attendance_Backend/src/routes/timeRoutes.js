const express = require('express');
const router = express.Router();
const { createTime, lastData } = require('../controllers/timeController');

router.post('/createTime',createTime);
router.get('/:userId/lastData',lastData);

module.exports = router;