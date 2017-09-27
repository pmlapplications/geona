/**
 * @fileoverview User related controllers. All authentication controllers are dealt with in user_auth
 */
import * as config from '../config';
import * as menu from '../templates/menu';

/**
 * Main user home page; details everything related to the currently logged in user
 * 
 * @export
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Callback function 
 * @return {Boolean}
 */
export function index(req, res, next) {
  return next();
}

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
    res.redirect('../admin/setup');
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
