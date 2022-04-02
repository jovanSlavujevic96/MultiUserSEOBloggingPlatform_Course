const express = require('express');
const router = express.Router();

// controllers
const {create, list, read, remove} = require('../controllers/category');
const {requireSignin, adminMiddleware} = require('../controllers/auth');

// validators
const {runValidation} = require('../validators');
const {categoryCreateValidator } = require('../validators/category');

router.post('/category', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);

// any other router created later will be exported from here using `module.exports`
module.exports = router;
