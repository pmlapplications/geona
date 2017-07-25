import convict from 'convict';
import $ from 'jquery';
import {client as schema} from '../../common/config_schema.js';

export default class Config {
  constructor(clientConfig) {
    /** @const @type {Object} The convict config */
    this.config_ = convict(schema);
    this.config_.load(clientConfig);
  }

  get(name) {
    return this.config_.get(name);
  }

  set(name, value) {
    return this.config_.set(name, value);
  }

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
