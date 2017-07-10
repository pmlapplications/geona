import convict from 'convict';
import $ from 'jquery';

let conf = {};

/**
 * Load the config from the server.
 * @param  {Function} next Function to call when done
 */
export function loadConfig(next) {
  // Get the schema
  $.ajax({
    url: 'settings/config/schema',
    success: (schema) => {
      $.ajax({
        url: 'settings/config',
        success: (data) => {
          let config = data;
          conf = convict(schema);
          conf.load(config);
          next();
        },
      });
    },
  });
}

/**
 * Get the value of a propery from the config.
 * @param  {string} property The property to get
 * @return {*}               The property value
 */
export function get(property) {
  return conf.get(property);
}
