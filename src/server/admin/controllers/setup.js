/** @module admin/controller/main */
/**
 * @fileoverview Controllers for the Administration application
 */
import path from 'path';
import _ from 'lodash';
import fs from 'fs';

import * as config from '../../config';
import * as requestUtils from '../../utils/request';
import * as menu from '../../templates/menu';
import DatabaseAdapter from '../../database';

import User from '../../models/users';


let subFolderPath = config.server.get('subFolderPath');

/**
 * Returns the database setup page; should only be availabe to Administrators
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 */
export function database(req, res) {
  let data = {
    content: {
      sqlitePath: path.join(__dirname, '../../../../database/geona.db'),
      postgresServer: 'localhost',
      postgresPort: '5432',
      postgresDbName: 'geona',
    },
    config: config.server.getProperties(),
    template: 'setup_database',
    menu: menu.getMenu('/admin'),
  };

  res.render('admin_template', data);
}

/**
 * Handles the form data from the database setup page
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
export function databaseHandler(req, res, next) {
  let data = req.body;
  let database = {};

  if (data.databaseType === 'sqlite3') {
    database.type = 'sqlite3';
    database.path = data.sqlitePath;

    // check if there's already a file there; we don't want to squash it
    if (fs.existsSync(database.path)) {
      let error = new Error('The SQLite database file already exists; to use this file add the path to <code>' + path.join(__dirname, '../../../config/config_server.json') + '</code>')
      requestUtils.displayFriendlyError(error, res);
    }

    // check if the directory is there, if not try to create it
    let folder = database.path.substring(0, database.path.lastIndexOf('/'));
    if (!fs.existsSync(folder)) {
      try {
        fs.mkdirSync(folder)
      } catch (error) {
        requestUtils.displayFriendlyError(error, res);
      }
    }
  } else {
    // must be Postgres
    database.type = 'postgres';
    database.path = data.postgresUsername + ':' + data.postgresPassword + '@' + data.postgresServer + ':' + data.postgresPort + '/' + data.postgresDbName;
  }

  let dbAdapter = new DatabaseAdapter(database.type, database.path);
  try {
    dbAdapter.initialiseDatabase();
  } catch (error) {
    requestUtils.displayFriendlyError(error, res);
    return false;
  }

  config.server.set('database.type', database.type);
  config.server.set('database.path', database.path);
  config.updateServerConfig(config.server);

  res.redirect(subFolderPath + '/admin');
}

/**
 * Returns the setup page if there is currently no OAuth configuration setup
 * 
 * @export
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export function oauth(req, res) {
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
export function oauthHandler(req, res) {
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

  // let update = config.updateServerConfig(serverConfig);
  // if (typeof(update) === Error) {
  //   requestUtils.displayFriendlyError(update, res);
  // } else {
  //   res.redirect(subFolderPath + '/admin');
  // }

  let user = User.findOrCreate({
    where: {
      username: 'bac@pml.ac.uk',
    },
    defaults: {
      firstName: 'Ben',
      lastName: 'Calton',
    }
  });

  return false;
}
