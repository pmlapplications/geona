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
router.get('/setup', adminController.setup);
router.post('/setup', adminController.setupPost);

