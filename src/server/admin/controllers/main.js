/**
 * @fileoverview Controllers for the Administration application
 * 
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */
import * as config from '../../config';
import * as menu from '../templates/menu';

/**
 * Renders the main index page for the administration application
 * @param {*} req 
 * @param {*} res 
 */
export function index(req, res) {
  // if there are no OAuth providers configured send the user to the setup page
  if (config.server.get('OAuth').length === 0) {
    res.redirect('admin/setup');
  }

  // if the user is not currently logged in send them to the login page
  if (req.session === 'undefined') {
    res.redirect('admin/login');
  }

  // if they are logged in show the goodies...
  let data = {
    config: config.server.getProperties(),
    template: 'temp2',
    menu: menu.getMenu('/admin'),
    body: 'Something',
  };

  res.render('admin_template', data);
}

/**
 * Return the login page for non-authenticated user to login
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */
export function login(req, res) {
  let data = {
    config: config.server.getProperties(),
    template: 'login',
    menu: menu.getMenu('/admin'),
  };

  res.render('admin_template', data);
}

/**
 * Returns the setup page if there is currently no OAuth configuration setup
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */
export function setup(req, res) {
  let data = {
    config: config.server.getProperties(),
    template: 'setup',
    menu: menu.getMenu('/admin'),
  };

  if (config.server.get('OAuth').length !== 0) {
    // At least one OAuth provider has been configured so the user cannot see the setup page
    data.template = 'setup_forbidden';
    res.status(403).render('admin_template', data);
  } else {
    res.render('admin_template', data);
  }
}
