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
