import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max : 32,
    },
    slug: { // if name is "new arrival" , then slug is "new-arrival"
        type: String,
        unique: true,
        index: true,
    },
}, {timestamp: true});

export default  mongoose.model('Tag', tagSchema);
