const express = require('express');
const router = express.Router();
const {time} = require('../controllers/blog');

router.get('/', time);

// any other router created later will be exported from here using `module.exports`
module.exports = router;
