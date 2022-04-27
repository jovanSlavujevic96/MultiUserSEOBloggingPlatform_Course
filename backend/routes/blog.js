import express from 'express';
const router = express.Router();

import {
    createBlog, listAllBlogs, listAllBlogsCategoriesTags, readBlog,
    removeBlog, updateBlog, getBlogPhoto
} from '../controllers/blog.js';
import { requireSignin, adminMiddleware } from '../controllers/auth.js';

router.post('/blog', requireSignin, adminMiddleware, createBlog);
router.get('/blogs', listAllBlogs);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', readBlog);
router.delete('/blog/:slug', requireSignin, adminMiddleware, removeBlog);
router.put('/blog/:slug', requireSignin, adminMiddleware, updateBlog);
router.get('/blog/photo/:slug', getBlogPhoto);

export default router;
