import slugify from 'slugify';

import Blog from '../models/blog.js';
import Category from '../models/category.js';
import {errorHandler} from '../helpers/dbErrorHandler.js';

const create = (req, res) => {
    const {name} = req.body;
    let slug = slugify(name).toLowerCase();

    let category = new Category({name, slug});

    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

const list = (req, res) => {
    // pass the empty object {} fo find method to get all objects (categories)
    Category.find({}).exec((err,data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

const read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOne({slug}).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(category);
        Blog.find({categories: category})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name')
        .select('_id title slug excerpt categories tags postedBy createAd updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json({ category: category, blogs: data });
        });
    });
};

const remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOneAndRemove({slug}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Category deleted successfully'
        });
    });
}

export { create };
export { list };
export { read };
export { remove };
