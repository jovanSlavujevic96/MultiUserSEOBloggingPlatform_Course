import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        min: 3,
        max : 160, /* standard for meta-description title */
        index: true,
        require: true,
    },
    slug: {
        type: String,
        unique: true,
        index: true,
    },
    body: {
        type: {}, /* {} means to store all kinds of data */
        required: true,
        min: 200,    // 200 bytes
        max: 2000000 // 2Mb
    },
    excerpt: { /* snippet - first few lines/character from the body - PREVIEW */
        type: String,
        max: 1000
    },
    mtitle: { /* META TITLE */
        type: String,
    },
    mdesc: { /* META DESCRIPTION */
        type: String,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    categories: [{type: ObjectId, ref: 'Category', required: true}],
    tags: [{type: ObjectId, ref: 'Tag', required: true}],
    /*
        [] - means array of categories
        ObjectId type - it will point to actually category model from mongoDB
        ref - it references to 'Category' model
    */

    postedBy: {
        type: ObjectId,
        ref: 'User',
    }
}, {timestamps: true});

export default mongoose.model('Blog', blogSchema);
