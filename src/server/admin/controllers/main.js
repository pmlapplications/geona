/**
 * @fileoverview Controllers for the Administration application
 * 
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */
import * as config from '../../config';
import * as requestUtils from '../../utils/request';
import * as menu from '../templates/menu';
import convict from 'convict';
import * as path from 'path';

import * as schema from '../../../common/config_schema.js';

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
    data: {
      authorizedOrigin: requestUtils.getAppBasePath(req),
      authorizedRedirectURI: requestUtils.getAppBasePath(req) + '/user/auth/google/callback',
      GitHubCallbackUrl: requestUtils.getAppBasePath(req) + '/user/auth/github/callback',
    },
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

/**
 * 
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */
export function setupPost(req, res) {
  let data = req.body;
  let providers = [];

  let serverConfig = convict(schema.server);
  serverConfig.loadFile(path.join(__dirname, '../../../../config/config_server.json'));

  // Add the Google details if they are complete
  if (data.google_clientId.length !== 0 && data.google_secret.length !== 0) {
    let provider = {
      google: {
        scope: 'https://www.googleapis.com/auth/userinfo.email',
        clientid: data.google_clientId,
        clientsecret: data.google_secret,
        callback: requestUtils.getAppBasePath(req) + '/user/auth/google/callback',
        prompt: 'select_account',
      },
    };
    providers.push(provider);
  }

  // Add the GitHub details if they are complete
  if (data.github_clientId.length !== 0 && data.github_secret.length !== 0) {
    let provider = {
      github: {
        scope: 'user:email',
        clientid: data.github_clientId,
        clientsecret: data.github_secret,
        callback: requestUtils.getAppBasePath(req) + '/user/auth/github/callback',
      },
    };
    providers.push(provider);
  }

  serverConfig.load({
    OAuth: providers,
  });

  // validate the config before saving it
  try {
    serverConfig.validate();
  } catch (e) {
    let responseData = {
      template: 'error',
      data: e,
    };
    res.status(500).render('admin_error', responseData);
  }

  res.redirect('../admin');
}
