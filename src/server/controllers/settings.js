/** @module controllers/settings */

import * as conf from '../config';

/**
 * Get the config for a client
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function config(req, res) {
  res.json(conf.clients.getProperties());
}
