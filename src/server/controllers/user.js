/**
 * @fileoverview User/authentication related controllers
 */
import * as config from '../config';
import * as menu from '../templates/menu';

/**
 * Return the login page for non-authenticated user to login
 * 
 * @export
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Boolean}
 */
export function login(req, res) {
  // if there are no OAuth providers configured send the user to the setup page
  if (config.server.get('OAuth').length === 0) {
    res.redirect('setup');
    return false;
  }

  let data = {
    config: config.server.getProperties(),
    template: 'login',
    menu: menu.getMenu('/admin'),
  };

  res.render('admin_template', data);
  return false;
}
