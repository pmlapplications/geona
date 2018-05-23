/** @module routers/state */

import express from 'express';

import * as state from '../controllers/state';

import * as mainController from '../controllers/main';

const router = express.Router();
export default router;

router.post('/saveStateToDatabase', state.saveStateToDatabase);
router.get('/loadStateFromDatabase/:stateId', state.loadStateFromDatabase);
router.get('/:stateId', mainController.index);
