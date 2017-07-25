import convict from 'convict';
import $ from 'jquery';
import {client as schema} from '../../common/config_schema.js';

export class Config {
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

// export async function getSchema(geonaServerUrl) {
//   let schema;
//   try {
//     schema = await $.ajax({
//       url: geonaServerUrl + '/settings/config/client_schema',
//     });
//     // .then((data) => {
//     //   schema = data;
//     //   return data;
//     // })
//     // .catch(); // TODO
//   } catch (e) {
//     // TODO
//     console.error(e);
//   }
//   return schema;
// }


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

/**
 * Get the value of a propery from the config.
 * @param  {string} property The property to get
 * @return {*}               The property value
 */
// export function get(property) {
//   return conf.get(property);
// }
