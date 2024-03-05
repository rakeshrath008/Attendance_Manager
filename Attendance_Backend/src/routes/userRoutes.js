const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserStatus, getUsers } = require('../controllers/userController');

router.get('/', getAllUsers);

router.put('/:userId/toggleStatus', toggleUserStatus);

router.get('/allusers',getUsers)

module.exports = router;
