/**
 * @fileoverview Controllers for the Administration application
 * 
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */

/**
 * Renders the main index page for the administration application
 * @param {*} req 
 * @param {*} res 
 */
export function index(req, res) {
  res.render('admin_index');
}
