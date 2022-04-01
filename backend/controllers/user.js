
const User = require('../models/user');

exports.read = (req, res) => {
    // we don't want to provide user information with password
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
};
