import User from '../models/user.js';
import Blog from '../models/blog.js';
import { errorHandler } from '../helpers/dbErrorHandler.js';

import _ from 'lodash';
import formidable from 'formidable';
import fs from 'fs';
import { error } from 'console';

const read = (req, res) => {
    // we don't want to provide user information with password
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
};

export { read };

export const publicProfile = (req, res) => {
    const username = req.params.username;

    User.findOne({username}).exec((err, userFromDB) => {
        let user;
        if (err || !userFromDB) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        user = userFromDB;
        Blog.find({postedBy: user._id})
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name')
            .limit(10)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAd')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                user.photo = undefined; // just to be sure
                user.hashed_password = undefined;
                res.json({
                    user, blogs: data
                });
            });
    });
};

export const update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save user
        let user = req.profile;
        user = _.extend(user, fields); // updates the fields that are changed

        if (fields.password && fields.password.length < 6) {
            return res.status(400).json({
                error: "Password should me min 6 characters long"
            });
        }

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1 MB'
                });
            }
            user.photo.data = fs.readFileSync(files.photo.filepath);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: 'All fields are required'
                });
            }
            user.hashed_password = undefined;
            res.json(user);
        });
    });
}

export const photo = (req, res) => {
    const username = req.params.username;
    User.findOne({username}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.photo.data) {
            res.set('Content-Type', user.photo.contentType);
            return res.send(user.photo.data);
        }
    });
}
