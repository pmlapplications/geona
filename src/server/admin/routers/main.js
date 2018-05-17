import express from 'express';

import * as adminController from '../controllers/main';

const router = express.Router();
export default router;

router.get('/', adminController.index);
