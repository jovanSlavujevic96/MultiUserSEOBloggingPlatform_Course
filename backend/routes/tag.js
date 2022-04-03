import express from 'express';
const router = express.Router();

// controllers
import {create, list, read, remove} from '../controllers/tag.js';
import {requireSignin, adminMiddleware} from '../controllers/auth.js';

// validators
import {runValidation} from '../validators/index.js';
import {tagCreateValidator } from '../validators/tag.js';

router.post('/tag', tagCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/tags', list);
router.get('/tag/:slug', read);
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove);

/**********************************************************************************
 * any other router created later will be exported from here using `module.exports`
// module.exports = router;
 * must to replace to export (BELOW)
***********************************************************************************/
export default router;
