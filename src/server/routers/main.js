/** @module routers/main */

import express from 'express';

import * as config from '../config';

import adminRouter from '../admin/routers/main';
import settingsRouter from './settings';
import utilsRouter from './utils';
import mapRouter from './map';
import stateRouter from './state';

import * as mainController from '../controllers/main';

// Setup and export main router
const router = express.Router();
export default router;

let subFolderPath = config.server.get('subFolderPath');

router.get(subFolderPath + '/', mainController.index);

router.use(subFolderPath + '/admin', adminRouter);

router.use(subFolderPath + '/settings', settingsRouter);
router.use(subFolderPath + '/utils', utilsRouter);
router.use(subFolderPath + '/map', mapRouter);
router.use(subFolderPath + '/state', stateRouter);
