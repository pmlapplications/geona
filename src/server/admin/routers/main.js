/** @module admin/routers/main */
/**
 * @fileoverview Admin routes including to initial setup
 * 
 */
import express from 'express';

import * as adminController from '../controllers/main';

const router = express.Router();
export default router;

router.get('/', adminController.index);
router.get('/setup/oauth', adminController.setupOauth);
router.post('/setup/oauth', adminController.setupOauthHandler);

