/** @module admin/routers/main */
/**
 * @fileoverview Admin routes including to initial setup
 * 
 */
import express from 'express';

import * as adminController from '../controllers/main';
import * as setupController from '../controllers/setup';

const router = express.Router();
export default router;

router.get('/', adminController.index);

router.get('/setup/database', setupController.database);
router.post('/setup/database', setupController.databaseHandler);

router.get('/setup/oauth', setupController.oauth);
router.post('/setup/oauth', setupController.oauthHandler);

