import express from 'express';

import settingsRouter from './settings';
import utilsRouter from './utils';

import * as mainController from '../controllers/main';

// Setup and export main router
const router = express.Router();
export default router;

router.get('/', mainController.index);

router.use('/settings', settingsRouter);
router.use('/utils', utilsRouter);
