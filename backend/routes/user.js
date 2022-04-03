import express from 'express';
const router = express.Router();

import {requireSignin, authMiddleware} from '../controllers/auth.js';
import {read} from '../controllers/user.js';

router.get('/profile', requireSignin, authMiddleware, read);

// any other router created later will be exported from here using `module.exports`
export default router;
