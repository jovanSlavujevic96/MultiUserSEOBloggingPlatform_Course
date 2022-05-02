import express from 'express';
const router = express.Router();

import {requireSignin, authMiddleware} from '../controllers/auth.js';
import {read, publicProfile, update, photo} from '../controllers/user.js';

router.get('/profile', requireSignin, authMiddleware, read);
router.get('/user/:username', publicProfile, authMiddleware, read);
router.put('/user/update', requireSignin, authMiddleware, update);
router.get('/user/photo/:username', photo);

// any other router created later will be exported from here using `module.exports`
export default router;
