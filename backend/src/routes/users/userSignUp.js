const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { validateWith } = require('../../middleware/validate');
const { newUserValidation } = require('../../models/userValidator');

router.post('/signup', validateWith(newUserValidation), userController.signup);

module.exports = router;