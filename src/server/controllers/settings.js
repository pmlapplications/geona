/** @module controllers/settings */

import conf from '../config';

/**
 * Get the config for a client
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function config(req, res) {
  res.json(conf.getProperties().client);
}
