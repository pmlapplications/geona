import express from 'express';

import * as userController from '../controllers/user';

const router = express.Router();
export default router;

router.get('/', userController.index);
router.get('/login', userController.login);
