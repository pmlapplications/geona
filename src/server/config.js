/** @module config */

import chalk from 'chalk';
import convict from 'convict';
import * as path from 'path';
import * as fs from 'fs';

import * as packageJson from '../../package.json';
import * as schema from '../common/config_schema.js';

const _clientConfigFilePath = path.join(__dirname, '../../config/config_clients.json');
const _serverConfigFilePath = path.join(__dirname, '../../config/config_server.json');

export let server = _combinedServerConfig();
export let clients = _combinedClientConfig();


/**
 * Combines the defined client configuration with elements from package.json
 * 
 * @return {Object} Defined client configuration combined with elements from package.json
 */
function _combinedClientConfig() {
  // let clientConfig = convict([schema.client]);  //convict can process an array of config files; will probably want 
  // to implement this so leaving here for now
  let clientConfig = convict(schema.client);
  let packageContent = packageJson;

  clientConfig.loadFile(_clientConfigFilePath);
  try {
    clientConfig.validate();
  } catch (e) {
    console.error(chalk.red('\nConfig error: ' + e.message + '\n'));
  }

  clientConfig.set('package.name', packageContent.name);
  clientConfig.set('package.version', packageContent.version);
  clientConfig.set('package.description', packageContent.description);
  clientConfig.set('package.repositoryUrl', packageContent.repository.url);

  return clientConfig;
}

/**
 * Combines the defined server configuration with elements from package.json
 * 
 * @return {Object} Defined server config values combined with default values from the schema, plus
 * name, version and description from package.json
 */
function _combinedServerConfig() {
  let serverConfig = convict(schema.server);
  let packageContent = packageJson;

  serverConfig.loadFile(_serverConfigFilePath);
  try {
    serverConfig.validate();
  } catch (e) {
    console.error(chalk.red('\nConfig error: ' + e.message + '\n'));
  }

  /** some checks/tweaks to make sure that the subfolder starts with a slash and does not end with a slash */
  let subFolderPath = serverConfig.get('subFolderPath');

  /** does the subfolder start with a slash, if not then add one */
  if (subFolderPath.indexOf('/', 0) !== 0) {
    subFolderPath = '/' + subFolderPath;
    serverConfig.set('subFolderPath', subFolderPath);
  }
  /** is there a trailing slash, take if off if there is */
  if (subFolderPath.lastIndexOf('/') === (subFolderPath.length - 1)) {
    subFolderPath = subFolderPath.substr(0, subFolderPath.length - 1);
    serverConfig.set('subFolderPath', subFolderPath);
  }

  serverConfig.set('package.name', packageContent.name);
  serverConfig.set('package.version', packageContent.version);
  serverConfig.set('package.description', packageContent.description);
  serverConfig.set('package.repositoryUrl', packageContent.repository.url);

  return serverConfig;
}

/**
 * Can be used to update the server config without restarting the application
 * 
 * @export
 * @param {Object} config - Convict server configuration object
 * @return {Boolean|Error}
 */
export function updateServerConfig(config) {
  // remove the `package` elements that `_combinedServerConfig` adds
  let configProperties = config.getProperties();
  delete configProperties.package;

  let serverConfig = convict(schema.server);
  serverConfig.load(configProperties);

  // validate the config and then save it back to file
  try {
    serverConfig.validate();
    fs.writeFileSync(_serverConfigFilePath, serverConfig.toString());
  } catch (e) {
    return e;
  }

  // Update the global `server` variable with the new validated config
  server = config;
  return true;
}
