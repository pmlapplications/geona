/** @module routers/utils */

import express from 'express';

import * as utils from '../controllers/utils';

const router = express.Router();
export default router;

router.get('/wcs/getLayers/:url', utils.wcsGetLayers);
router.get('/wms/getLayers/:url', utils.wmsGetLayers);
router.get('/wmts/getLayers/:url', utils.wmtsGetLayers);
