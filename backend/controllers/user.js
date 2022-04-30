import User from '../models/user.js';
import Blog from '../models/blog.js';
import { errorHandler } from '../helpers/dbErrorHandler.js';


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
                res.json({
                    user, blogs: data
                });
            });
    });
};
