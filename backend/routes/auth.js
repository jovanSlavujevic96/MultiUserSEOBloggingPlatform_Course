const express = require('express');
const router = express.Router();
const {signup} = require('../controllers/auth');

// validators
const {runValidation} = require('../validators'); /* index.js is default */
const {userSignupValidator} = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);

// any other router created later will be exported from here using `module.exports`
module.exports = router;
