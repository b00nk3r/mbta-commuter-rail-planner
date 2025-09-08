const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.post('/deleteAll', userController.deleteAll);

module.exports = router;