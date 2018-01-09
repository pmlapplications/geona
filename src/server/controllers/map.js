/** @module controllers/map */

import fs from 'fs';

/**
 * Render the index page
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function getCache(req, res) {
  // let cacheUri = '../../../cache/';
  let cacheUri = '/local1/data/scratch/git/web-development/gp2-contribution-guide/cache/';
  let searchFile = cacheUri + req.params.url;
  fs.readFile(searchFile, 'utf8', (err) => {
    if (err !== null) {
      res.status(404).send('File not found');
    } else {
      res.sendFile(searchFile);
    }
  });
}
