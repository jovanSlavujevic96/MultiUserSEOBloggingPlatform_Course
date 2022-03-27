const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // fixes browser-to-browser communication
    res.json({time: Date().toString()})
});

// any other router created later will be exported from here using `module.exports`
module.exports = router;
