/** @module controllers/user_auth */
/**
 * @fileoverview Authtentication controllers for passport
 */
import passport from 'passport';

import * as config from '../config.js';
import * as passportConfig from '../config_passport';

passportConfig.configureOauthProviders();

/**
 * Send the user off to Google for authentication
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
export function authGoogle(req, res, next) {
  if (typeof(req.query.r) !== 'undefined' && req.query.r !== '') {
    req.session.redirectAfterLogin = config.server.get('subFolderPath') + req.query.r;
  } else {
    req.session.redirectAfterLogin = config.server.get('subFolderPath') + '/user';
  }
  passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']})(req, res, next);
}

/**
 * The callback function that Google calls after authentication
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
export function authGoogleCallback(req, res, next) {
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: req.session.redirectAfterLogin,
  })(req, res, next);
}

/**
 * Send the user off to GitHub for authentication
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
export function authGitHub(req, res, next) {
  if (typeof(req.query.r) !== 'undefined' && req.query.r !== '') {
    req.session.redirectAfterLogin = config.server.get('subFolderPath') + req.query.r;
  } else {
    req.session.redirectAfterLogin = config.server.get('subFolderPath') + '/user';
  }
  passport.authenticate('github', {scope: ['https://www.googleapis.com/auth/plus.login']})(req, res, next);
}

/**
 * The callback function that GitHub calls after authentication
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
export function authGitHubCallback(req, res, next) {
  passport.authenticate('github', {
    failureRedirect: '/login',
    successRedirect: req.session.redirectAfterLogin,
  })(req, res, next);
}
