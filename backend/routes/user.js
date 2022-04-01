const express = require('express');
const router = express.Router();
const {requireSignin, authMiddleware} = require('../controllers/auth');
const {read} = require('../controllers/user');

router.get('/profile', requireSignin, authMiddleware, read);

// any other router created later will be exported from here using `module.exports`
module.exports = router;
