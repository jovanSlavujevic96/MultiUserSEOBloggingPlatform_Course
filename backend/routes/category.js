import express from 'express';
const router = express.Router();

// controllers
import {create, list, read, remove} from '../controllers/category.js';
import {requireSignin, adminMiddleware} from '../controllers/auth.js';

// validators
import {runValidation} from '../validators/index.js';
import {categoryCreateValidator } from '../validators/category.js';

router.post('/category', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);

export default router;
