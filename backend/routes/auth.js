const express = require('express');
const router = express.Router();
const {signup, signin, signout, requireSignin} = require('../controllers/auth');

// validators
const {runValidation} = require('../validators'); /* index.js is default */
const {userSignupValidator, userSigninValidator } = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);

// test
router.get('/secret', requireSignin, (req, res) => {
    res.json({
        message: 'You have access to secret page'
    });
});

// any other router created later will be exported from here using `module.exports`
module.exports = router;
