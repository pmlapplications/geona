/** @module admin/controller/main */
/**
 * @fileoverview Controllers for the Administration application
 */
import * as config from '../../config';
import * as requestUtils from '../../utils/request';
import * as menu from '../../templates/menu';
import _ from 'lodash';

let subFolderPath = config.server.get('subFolderPath');
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

/**
 * Returns the database setup page; should only be availabe to Administrators
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */
export function setupDatabase(req, res) {
  let data = {
    content: {},
    config: config.server.getProperties(),
    template: 'setup_database',
    menu: menu.getMenu(),
  };

  res.render('admin_template', data);
}

/**
 * Returns the setup page if there is currently no OAuth configuration setup
 * 
 * @export
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export function setupOauth(req, res) {
  let data = {
    content: {
      authorizedOrigin: requestUtils.getAppBasePath(req),
      authorizedRedirectURI: requestUtils.getAppBasePath(req) + '/user/auth/google/callback',
      GitHubCallbackUrl: requestUtils.getAppBasePath(req) + '/user/auth/github/callback',
    },
    config: config.server.getProperties(),
    template: 'setup_oauth',
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
 * Handles the OAuth setup form
 * 
 * @export
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Boolean}
 */
export function setupOauthHandler(req, res) {
  let data = req.body;
  let providers = [];
  let serverConfig = config.server;

  // get the admin email address(es)
  let emails = data.administrators.split(/,|;/);
  let admins = [];
  _.forEach(emails, function(email) {
    admins.push(email.trim());
  });

  serverConfig.load({
    administrators: admins,
  });

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

  // merge the new OAuth provider details into the config
  serverConfig.load({
    OAuth: providers,
  });

  let update = config.updateServerConfig(serverConfig);
  if (typeof(update) === Error) {
    requestUtils.displayFriendlyError(update, res);
  } else {
    res.redirect(subFolderPath + '/admin');
  }

  return false;
}
