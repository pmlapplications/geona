/** @module controllers/state */

import fs from 'fs';
import path from 'path';
import request from 'request';


/**
 * Saves the current Geona state to a unique file name in the database. TODO currently saves to the 'state' folder on
 * local disk.
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function saveStateToDatabase(req, res) {
  let stateUri = path.join(__dirname, '..', '..', '..', 'state/');
  let fileId = generateHashCode();
  let filePath = stateUri + fileId + '.json';

  if (!req.body || !req.body.map || !req.body.controls || !req.body.intro) {
    res.status(400).send(new Error('Geona state JSON was incorrectly formed. Printing JSON: ' + JSON.stringify(req.body)));
  } else {
    fs.readFile(filePath, 'utf8', (err) => {
      if (err !== null) { // File with that name does not exist
        try {
          fs.writeFileSync(filePath, JSON.stringify(req.body), 'utf8');
          res.status(200).send(fileId);
        } catch (writeError) {
          res.status(500).send(writeError);
        }
      } else { // Found file with that name
        saveStateToDatabase(req, res); // We recurse, generating another file name and trying to save that again
      }
    });
  }
}

export function loadStateFromDatabase(req, res) {

}

/**
 * Generates a hash to use when saving a state. The hashing function was taken from https://stackoverflow.com/a/32649933
 */
function generateHashCode() {
  // return (Number(new Date)).toString(36).slice(-6);
  return (Number(new Date)).toString(36);
}
