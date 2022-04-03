import express from 'express';
const router = express.Router();

import { createBlog } from '../controllers/blog.js';
import { requireSignin, adminMiddleware } from '../controllers/auth.js';

router.post('/blog', requireSignin, adminMiddleware, createBlog);

export default router;
