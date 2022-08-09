import shortId from 'shortid';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt'
import _ from 'lodash';

import User from '../models/user.js';
import Blog from '../models/blog.js';
import { errorHandler } from '../helpers/dbErrorHandler.js';

import sgMail from '@sendgrid/mail'; // SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import { OAuth2Client } from 'google-auth-library';
import user from '../models/user.js';

export const preSignup = (req, res) => {
    const {name, email, password} = req.body;
    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });

        const emailData = {
            to: email,
            from: `${process.env.EMAIL_FROM}`,
            subject: `Account activation link`,
            html: `
                <p>Please use the following link to activate your account:</p>
                <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
                <hr/>
                <p>This email may contain sensetive information</p>
                <p>https://seoblog.com</p>
            `
        };

        sgMail.send(emailData).then(sent => {
            return res.json({
                message: `
Email has been sent to ${email}.
Follow the instructions to activate your account.
                `
            });
        })
    });
}

const signup = (req, res) => {
    const token = req.body.token;
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: 'Expired link. Signup again.'
                });
            }

            const {name, email, password} = jwt.decode(token);

            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;

            const user = new User({name, email, password, profile, username});
            user.save((err, user) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }
                return res.json({
                    message: 'Signup success! Please signin.'
                });
            });
        });
    } else {
        return res.json({
            message: 'Something went wrong. Try again.'
        });
    }
}

// const signup = (req, res) => {
//     User.findOne({email: req.body.email}).exec((err, user) => {
//         if (user) {
//             return res.status(400).json({
//                 error: 'Email is taken'
//             });
//         }

//         const {name, email, password} = req.body;
//         let username = shortId.generate();
//         let profile = `${process.env.CLIENT_URL}/profile/${username}`;

//         let newUser = new User({name, email, password, profile, username});
//         newUser.save((err, success) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             }
//             // res.json({
//             //     user: success
//             // })
//             res.json({
//                 message: 'Signup success! Please signin.'
//             });
//         });
//     });
// }

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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = (req, res) => {
    const idToken = req.body.tokenId;
    client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID})
        .then(response => {
            // console.log(respsone);
            const {email_verified, name, email, jti} = response.payload;

            if (email_verified) {
                User.findOne({email}).exec((err, user) => {
                    // if user already exist -> sign in
                    if (user) {
                        // console.log(user);
                        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
                        const {_id, email, name, role, username} = user;

                        res.cookie('token', token, {expiresIn: '1d'});
                        return res.json({token, user: {_id, email, name, role, username}})
                    }
                    // if user don't exist -> sign up
                    else {
                        let username = shortId.generate();
                        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
                        // let password = jti;
                        // for further security
                        let password = jti + process.env.JWT_SECRET;

                        user = new User({name, email, profile, username, password});
                        user.save((err, data) => {
                            if (err) {
                                return res.status(400).json({
                                    errror: errorHandler(err)
                                });
                            }

                            const token = jwt.sign({_id: data._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
                            const {_id, email, name, role, username} = data;

                            res.cookie('token', token, {expiresIn: '1d'});
                            return res.json({token, user: {_id, email, name, role, username}})
                        });
                    }
                });
            } else {
                return res.status(400).json({
                    error: 'Google login failed. Try again.'
                });
            }
        });
}
