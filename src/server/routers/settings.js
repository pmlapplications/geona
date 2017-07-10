import express from 'express';

import * as settings from '../controllers/settings';

const router = express.Router();
export default router;

router.get('/config', settings.config);
router.get('/config/schema', settings.configSchema);
