/**
 * @module routers/user
 * @fileoverview Sets up routes for user login and authentication via OAuth 
 */
import express from 'express';

import * as userController from '../controllers/user';
import * as authController from '../controllers/user_auth';

const router = express.Router();
export default router;

router.get('/', userController.index);
router.get('/login', userController.login);

router.get('/auth/google', authController.authGoogle);
router.get('/auth/google/callback', authController.authGoogleCallback);

router.get('/auth/github', authController.authGitHub);
router.get('/auth/github/callback', authController.authGitHubCallback);
