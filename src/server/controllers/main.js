/** @module controllers/main */

/**
 * Render the index page
 * @param  {Object} req Express request
 * @param  {Object} res Express response
 */
export function index(req, res) {
  res.render('index');
}
