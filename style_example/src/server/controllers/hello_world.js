/**
 * Return 'Hello World!'
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function world(req, res) {
  res.send('Hello World!');
}

/**
 * Respond with 'Hello Galaxy!'
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function galaxy(req, res) {
  res.send('Hello Galaxy!');
}

/**
 * Respond with 'Hello Universe!'
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function universe(req, res) {
  res.send('Hello Universe!');
}
