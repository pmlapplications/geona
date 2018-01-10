/** @module routers/map */

import express from 'express';

import * as map from '../controllers/map';

const router = express.Router();
export default router;

router.get('/getCache/:url', map.getCache);
router.get('/getLayerServer/:url/:service/:save/:useCache', map.getServersideLayerServer);
