/** @module config */

import convict from 'convict';
import {client as schema} from '../../common/config_schema.js';

/**
 * The config manager for the client config.
 * Handles loading, validating and accessing the config.
 */
export default class Config {
  /**
   * Create a new Config instance, optionally providing a JSON config to load.
   * @param  {Object} clientConfig A JSON config to load.
   */
  constructor(clientConfig) {
    /** @desc The convict config instance @type {Object} @const*/
    this.config_ = convict(schema);
    this.config_.load(clientConfig);

    if (!this.config_.get('divId').startsWith('#')) {
      this.config_.set('divId', '#' + this.config_.get('divId'));
    }

    this.config_.validate();
  }

  /**
   * Returns the current value of the key property. key can use dot notation to reference nested values.
   * @param  {String} key The config key to get
   * @return {*}           The config value for the provided key.
   */
  get(key) {
    return this.config_.get(key);
  }

  /**
   * Sets the value of key to value. key can use dot notation to reference nested values, e.g. "database.port".
   * If objects in the chain don't yet exist, they will be initialized to empty objects.
   * @param {String} key  The config key to set
   * @param {*}      value The config value to set
   */
  set(key, value) {
    this.config_.set(key, value);
  }

  /**
   * Exports all the properties (that is the keys and their current values) as JSON.
   * @return {Object} The full current config as JSON.
   */
  getProperties() {
    return this.config_.getProperties();
  }
}

// Will be used to download a config from the server if one isn't provided locally
// export function loadConfig(config, next) {
//   $.ajax({
//     url: 'settings/config',
//     success: (data) => {
//       let config = data;
//       conf.load(config);
//       next();
//     },
//   });
// }
