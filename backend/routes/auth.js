const express = require('express');
const router = express.Router();
const {signup} = require('../controllers/auth');

router.post('/signup', signup);

// any other router created later will be exported from here using `module.exports`
module.exports = router;
