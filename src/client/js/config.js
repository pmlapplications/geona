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
    /** @const @type {Object} The convict config instance */
    this.config_ = convict(schema);
    this.config_.load(clientConfig);
  }

  /**
   * Returns the current value of the name property. name can use dot notation to reference nested values.
   * @param  {String} name The config key to get
   * @return {*}           The config value for the provided key.
   */
  get(name) {
    return this.config_.get(name);
  }

  /**
   * Sets the value of name to value. name can use dot notation to reference nested values, e.g. "database.port".
   * If objects in the chain don't yet exist, they will be initialized to empty objects.
   * @param {String} name  The config key to set
   * @param {*}      value The config value to set
   */
  set(name, value) {
    this.config_.set(name, value);
  }

  /**
   * Exports all the properties (that is the keys and their current values) as JSON.
   * @return {Object} The full current config as JSON.
   */
  getProperties() {
    return this.config_.getProperties();
  }
}

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
