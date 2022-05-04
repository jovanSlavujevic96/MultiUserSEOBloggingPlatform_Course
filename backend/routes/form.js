import express from 'express';
const router = express.Router();

// controllers
import { contactForm } from '../controllers/form.js';

// validators
import { runValidation } from '../validators/index.js';
import { contactFormValidator } from '../validators/form.js';

router.post('/contact', contactFormValidator, runValidation, contactForm);

export default router;
