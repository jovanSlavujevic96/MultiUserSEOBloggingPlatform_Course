import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { mongoose } from 'mongoose';

/**
 * Foollowing line:
// require('dotenv').config();
 * Replaced by one bellow:
**/
import 'dotenv/config';

// bring routes
import blogRoutes from './routes/blog.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js';
import tagRoutes from './routes/tag.js';

// app
const app = express();

// db
mongoose
    .connect(process.env.DATABASE_LOCAL, {})
    .then(() => console.log('DB connected'))
    .catch((err) => console.log("DB Error => ", err));

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

// cors
if (process.env.NODE_ENV == 'development') {
    app.use(cors({origin: `${process.env.CLIENT_URL}` }));
}

// routes middleware
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is runnin on port ${port}`);
});
