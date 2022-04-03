import slugify from 'slugify';

import Tag from '../models/tag.js';
import {errorHandler} from '../helpers/dbErrorHandler.js';

const create = (req, res) => {
    const {name} = req.body;
    let slug = slugify(name).toLowerCase();

    let tag = new Tag({name, slug});

    tag.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

const list = (req, res) => {
    Tag.find({}).exec((err,data) => {
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

    Tag.findOne({slug}).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(category);
    });
};

const remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOneAndRemove({slug}).exec((err, data) => {
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
