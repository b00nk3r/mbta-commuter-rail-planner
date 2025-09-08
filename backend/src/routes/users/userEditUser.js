const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.post('/editUser', userController.editUser);

module.exports = router;