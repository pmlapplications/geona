/**
 * @fileoverview A suite of utility functions that are commonly used throughout the server application to handle or 
 * identify elements of a request
 */
import * as config from '../config';
import _ from 'lodash';

/**
 * Returns the hostname for a given request
 * 
 * @export
 * @param {Object} req - Express request object
 * @return {String} - Hostname the request was made to
 */
export function getHostname(req) {
  let hostname = req.hostname;
  let port = ':' + config.server.get('port');
  _.forEach(req.headers, function(value, header) {
    if (header.startsWith('x-forwarded')) { // the request has been proxied so we assume that we are running on standard ports
      port = '';
      return false;
    }
    return true;
  });
  return hostname + port;
}

/**
 * Returns the protocol used to make the request ensuring the correct protocol is used when requests have been proxied
 * 
 * @export
 * @param {Object} req - Express request object
 * @return {String} - Protocol used
 */
export function getProtocol(req) {
  let protocol = req.protocol;
  if (typeof(req.headers['x-forwarded-proto']) !== 'undefined') {
    protocol = req.headers['x-forwarded-proto'];
  }
  return protocol;
}

/**
 * Returns the application's base path, including port and sub folder where necessary
 * 
 * @export
 * @param {any} req - Expresss request object
 * @return {String} - Application base path including the sub folder
 */
export function getAppBasePath(req) {
  let subFolderPath = config.server.get('subFolderPath');
  let basePath = getProtocol(req) + '://' + getHostname(req) + subFolderPath;
  return basePath;
}
