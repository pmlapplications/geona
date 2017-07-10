import express from 'express';

import settingsRouter from './settings.js';

// Setup and export main router
const router = express.Router();
export default router;

router.use('/settings', settingsRouter);
