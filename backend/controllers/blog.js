import formidable from 'formidable';
import slugify from 'slugify';
import _ from 'lodash';
import fs from 'fs';

/********************************************************************
 * this caused error:
// const { stripHtml } = require('string-strip-html')
 * must replace require by dynamic import
 * added type: module u package.json
 * replaced require & module exports -> import & export everywhere
********************************************************************/
import { stripHtml } from 'string-strip-html';

import Blog from '../models/blog.js';
import Category from '../models/category.js';
import Tag from '../models/tag.js';
import User from '../models/user.js';
import {errorHandler} from '../helpers/dbErrorHandler.js';
import { smartTrim } from '../helpers/blog.js';

const createBlog = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true; /* if we have a files - keep their extension */
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        const {title, body, categories, tags} = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }
        else if (!body || body.length < 200) {
            return res.status(400).json({
                error: 'content is too short'
            });
        }
        else if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'At least one cateogry is required'
            });
        }
        else if (!tags || tags.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            });
        }

        let blog = new Blog();

        // asign values
        blog.title = title;
        blog.slug = slugify(title).toLowerCase();
        blog.body = body;
        blog.excerpt = smartTrim(body, 320, ' ', ' ...');
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0, 160)).result;
        blog.postedBy = req.user._id;

        // categories & tags
        let arrayOfCategories = categories && categories.split(', ');
        let arrayOfTags = tags && tags.split(', ');

        if (files.photo) {
            if (files.photo.size > 1000000) { // if files is bigger than 1Mb
                if (err) {
                    return res.status(400).json({
                        error: 'Image should be less than 1Mb in size'
                    });
                }
            }

            blog.photo.data = fs.readFileSync(files.photo.filepath);
            blog.photo.contentType = files.photo.types;
        }

        blog.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // test -> just return generated databse object
            // return res.json(result);

            /* try to update blog by adding categories */
            Blog.findByIdAndUpdate(result._id, {$push: {categories: arrayOfCategories}}, {new: true}).exec((err, result) => {
                if (err) {
                    /* failure */
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                } else {
                    /* success */
                    /* try to update blog by adding tags */
                    Blog.findByIdAndUpdate(result._id, {$push: {tags: arrayOfTags}}, {new: true}).exec((err, result) => {
                        if (err) {
                            /* failure */
                            return res.status(400).json({
                                error: errorHandler(err)
                            });
                        } else {
                            /* success */
                            res.json(result);
                        }
                    });
                }
            });

        });

    });
};

export { createBlog };

export const listAllBlogs = (req, res) => {
    Blog.find({}) // empty object {} will give us all the blogs
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        })
};

export const listAllBlogsCategoriesTags = (req, res) => {
    // how many blog posts we want to send to each request
    // we want to grab limit from the frontend
    const limit = req.body.limit ? parseInt(req.body.limit) : 10;
    const skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            blogs = data; // got blogs

            // get all categories
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                categories = c; // got categories
            });

            // get all tags
            Tag.find({}).exec((err, t) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                tags = t; // got tags

                // return all blogs, categories & tags
                res.json({blogs, categories, tags, size: blogs.length})
            });
        });
};

export const readBlog = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
        .populate('categories', '_id name slug')            // informations extracted from categories
        .populate('tags', '_id name slug')                  // informations extracted from tags
        .populate('postedBy', '_id name username profile')  // informations extracted from users
        .select('_id title body slug categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

export const removeBlog = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOneAndRemove({slug})
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json({
                message: 'Blog deleted successfully'
            })
        })
};

export const updateBlog = (req, res) => {

};

