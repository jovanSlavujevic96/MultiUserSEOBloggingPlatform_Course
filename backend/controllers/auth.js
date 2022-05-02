import shortId from 'shortid';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt'

import User from '../models/user.js';

const signup = (req, res) => {
    User.findOne({email: req.body.email}).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const {name, email, password} = req.body;
        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;

        let newUser = new User({name, email, password, profile, username});
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            // res.json({
            //     user: success
            // })
            res.json({
                message: 'Signup success! Please signin.'
            });
        });
    });
}

const signin = (req, res) => {
    const {email, password} = req.body;

    // check if user exist
    User.findOne({email}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup."
            });
        }

        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match.'
            });
        }

        // generate a token and send to client
        const token = jwt.sign( { _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { expiresIn: '1d' });
        const {_id, username, name, email, role} = user;
        return res.json({
            token,
            user: {_id, username, name, email, role}
        })
    });
};

const signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: "Signout success"
    });
}

const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // must be added
});

const authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findById({_id: authUserId}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    });
};

const adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findById({_id: adminUserId}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        // https://stackoverflow.com/questions/8616483/javascript-comparison-operators-vs
        if (user.role !== 1) {
            return res.status(400).json({
                error: 'Admin resource. Acces denied'
            });
        }

        req.profile = user;
        next();
    });
};

export { signup };
export { signin };
export { signout };
export { requireSignin };
export { authMiddleware };
export { adminMiddleware };
