import express from 'express';
const router = express.Router();

import {
    createBlog, listAllBlogs, listAllBlogsCategoriesTags, readBlog,
    removeBlog, updateBlog, getBlogPhoto, listRelatedBlogs, listSearchBlogs,
    listBlogsByUser
} from '../controllers/blog.js';
import { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } from '../controllers/auth.js';

router.post('/blog', requireSignin, adminMiddleware, createBlog);
router.get('/blogs', listAllBlogs);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', readBlog);
router.delete('/blog/:slug', requireSignin, adminMiddleware, removeBlog);
router.put('/blog/:slug', requireSignin, adminMiddleware, updateBlog);
router.get('/blog/photo/:slug', getBlogPhoto);
router.post('/blogs/related', listRelatedBlogs);
router.get('/blogs/search', listSearchBlogs);

// auth user blog crud
router.post('/user/blog', requireSignin, authMiddleware, createBlog);
router.get('/:username/blogs', listBlogsByUser);
router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, removeBlog);
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, updateBlog);

export default router;
