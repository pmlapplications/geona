/** @module routers/main */

import express from 'express';

import * as config from '../config';

import adminRouter from '../admin/routers/main';
import settingsRouter from './settings';
import userRouter from './user';
import utilsRouter from './utils';

import * as mainController from '../controllers/main';

let subFolderPath = config.server.get('subFolderPath');

// Setup and export main router
const router = express.Router();
export default router;

router.get(subFolderPath + '/', mainController.index);

router.use(subFolderPath + '/admin', adminRouter);

router.use(subFolderPath + '/settings', settingsRouter);
router.use(subFolderPath + '/user', userRouter);
router.use(subFolderPath + '/utils', utilsRouter);
