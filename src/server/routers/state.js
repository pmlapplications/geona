/** @module routers/state */

import express from 'express';

import * as state from '../controllers/state';

const router = express.Router();
export default router;

router.post('/saveStateToDatabase', state.saveStateToDatabase);
router.get('/:stateId', state.loadStateFromDatabase);
