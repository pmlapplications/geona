/** @module config */

import chalk from 'chalk';
import convict from 'convict';
import * as path from 'path';
import * as packageJson from '../../package.json';

import * as schema from '../common/config_schema.js';

export let server = combinedServerConfig();

export let clients = combinedClientConfig();

/**
 * Combines the defined client configuration with elements from package.json
 * 
 * @return {Object} Defined client configuration combined with elements from package.json
 */
function combinedClientConfig() {
  // let clientConfig = convict([schema.client]);  //convict can process an array of config files; will probably want 
  // to implement this so leaving here for now
  let clientConfig = convict(schema.client);
  let packageContent = packageJson;

  clientConfig.loadFile(path.join(__dirname, '../../config/config_clients.json'));
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
function combinedServerConfig() {
  let serverConfig = convict(schema.server);
  let packageContent = packageJson;

  serverConfig.loadFile(path.join(__dirname, '../../config/config_server.json'));
  try {
    serverConfig.validate();
  } catch (e) {
    console.error(chalk.red('\nConfig error: ' + e.message + '\n'));
  }

  /** some checks/tweaks to make sure that the subfolder starts with a slash and does not end with a slash */
  let value = serverConfig.get('subFolderPath');

  /** does the subfolder start with a slash, if not then add one */
  if (value.indexOf('/', 0) !== 0) {
    value = '/' + value;
    serverConfig.set('subFolderPath', value);
  }
  /** is there a trailing slash, take if off if there is */
  if (value.lastIndexOf('/') === (value.length - 1)) {
    value = value.substr(0, value.length - 1);
    serverConfig.set('subFolderPath', value);
  }

  serverConfig.set('package.name', packageContent.name);
  serverConfig.set('package.version', packageContent.version);
  serverConfig.set('package.description', packageContent.description);
  serverConfig.set('package.repositoryUrl', packageContent.repository.url);

  return serverConfig;
}
