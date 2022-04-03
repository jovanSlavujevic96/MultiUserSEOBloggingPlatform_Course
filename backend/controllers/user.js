
import User from '../models/user.js';

const read = (req, res) => {
    // we don't want to provide user information with password
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
};

export { read };
