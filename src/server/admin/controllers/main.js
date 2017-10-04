/** @module admin/controller/main */
/**
 * @fileoverview Controllers for the Administration application
 */
import * as config from '../../config';
import * as menu from '../../templates/menu';

let subFolderPath = config.subFolderPath;
/**
 * Renders the main index page for the administration application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Boolean}
 */
export function index(req, res) {
  // if there are no OAuth providers configured send the user to the setup page
  if (config.server.get('OAuth').length === 0) {
    res.redirect(subFolderPath + '/admin/setup/oauth');
    return false;
  }
  // if there are no database connection parameters configured send the user to the db setup page
  if (config.server.get('database.path').length === 0) {
    res.redirect(subFolderPath + '/admin/setup/database');
    return false;
  }

  // if the user is not currently logged in send them to the login page
  if (typeof(req.session.passport) === 'undefined') {
    res.redirect(subFolderPath + '/user/login?r=/admin');
    return false;
  }

  // if they are logged in show the goodies...
  let data = {
    config: config.server.getProperties(),
    template: 'admin_home',
    menu: menu.getMenu('/admin'),
    content: 'Something',
  };

  res.render('admin_template', data);
  return false;
}
