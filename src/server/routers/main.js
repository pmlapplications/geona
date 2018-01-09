/** @module routers/main */

import express from 'express';

import settingsRouter from './settings';
import utilsRouter from './utils';
import mapRouter from './map';

import * as mainController from '../controllers/main';

// Setup and export main router
const router = express.Router();
export default router;

router.get('/', mainController.index);

router.use('/settings', settingsRouter);
router.use('/utils', utilsRouter);
router.use('/map', mapRouter);
