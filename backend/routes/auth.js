import express from 'express';
const router = express.Router();
import {signup, signin, signout, forgotPassword, resetPassword, preSignup, googleLogin} from '../controllers/auth.js';
// import { requireSignin } from '../controllers/auth.js';

// validators
import {runValidation} from '../validators/index.js';
import {userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/auth.js';

router.post('/pre-signup', userSignupValidator, runValidation, preSignup);
router.post('/signup', signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);
// google login
router.post('/google-login', googleLogin);

export default router;
