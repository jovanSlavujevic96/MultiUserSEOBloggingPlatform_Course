import shortId from 'shortid';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt'

import User from '../models/user.js';
import Blog from '../models/blog.js';
import { errorHandler } from '../helpers/dbErrorHandler.js';

import sgMail from '@sendgrid/mail'; // SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
import _ from 'lodash';

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

export const canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
        .select('-photo')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            const authorizedUser = (data.postedBy._id.toString() === req.profile._id.toString());
            if (!authorizedUser) {
                return res.status(400).json({
                    error: 'You are not authorized'
                });
            }
            next();
        });
};

export const forgotPassword = (req, res) => {
    // grab the e-mail
    const {email} = req.body;

    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: 'User with that email does not exist'
            });
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_RESET_PASSWORD, {expiresIn: '10m'});

        // send email
        const emailData = {
            to: email,
            from: `${process.env.EMAIL_FROM}`,
            subject: `Password reset link`,
            html: `
                <p>Please use the following link to reset your password:</p>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr/>
                <p>This email may contain sensetive information</p>
                <p>https://seoblog.com</p>
            `
        };

        // populating the db > user > resetPasswordLink
        return user.updateOne({resetPasswordLink: token}, (err, success) => {
            if (err) {
                return res.json({error: errorHandler(err)});
            } else {
                sgMail.send(emailData).then(sent => {
                    return res.json({
                        message: `
                            Email has been sent to ${email}.
                            Follow the instruction to reset your password.
                            Link expires in 10 min.
                        `
                    })
                })
            }
        })
    })
};

export const resetPassword = (req, res) => {
    const {resetPasswordLink, newPassword} = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink,
            process.env.JWT_RESET_PASSWORD,
            function(err, decoded) {
                if (err) {
                    return res.status(401).json({
                        error: 'Expired link. Try again'
                    });
                }
                User.findOne({resetPasswordLink}, (err, user) => {
                    if (err || !user) {
                        return res.status(401).json({
                            error: 'Something went wrong. Try later'
                        });
                    }
                    const updatedFields = {
                        password: newPassword,
                        resetPasswordLink: ''
                    };

                    // update fields to user in mongoDB
                    user = _.extend(user, updatedFields);
                    user.save((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler(err)
                            });
                        }
                        res.json({
                            message: `Great! Now you can login with your new password`
                        });
                    })
                });
            }
        )
    }
};
