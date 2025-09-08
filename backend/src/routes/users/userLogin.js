const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { validateWith } = require('../../middleware/validate');
const { userLoginValidation } = require('../../models/userValidator');

router.post('/login', validateWith(userLoginValidation), userController.login);

module.exports = router;