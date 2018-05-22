/** @module loader */

// import 'babel-polyfill';
import $ from 'jquery';

/* global geona */

let head = document.getElementsByTagName('head')[0];

let geonaCoreLoading = false;
let vendorJsLoaded = false;
let bundleJsLoaded = false;

/**
 * Load the core dependencies for Geona and create any queued Geona instances when ready.
 * @param  {String} geonaServer The server URl to download dependencies from. If undefined, relative paths are used
 */
function loadGeonaCore(geonaServer) {
  geonaCoreLoading = true;
  // Add Geona css to the page
  let mainCss = document.createElement('link');
  mainCss.rel = 'stylesheet';
  mainCss.type = 'text/css';
  mainCss.href = geonaServer + '/css/main.css';
  head.appendChild(mainCss);

  // Define the element for the bundle js
  let bundleJs = document.createElement('script');
  bundleJs.async = true;
  bundleJs.src = geonaServer + '/js/bundle.js';
  bundleJs.onload = function() {
    // When the bundleJs is loaded, call createInstances() to create Geona instances for any queued configs
    bundleJsLoaded = true;
    createInstances();
  };

  // Add the vendor js to the page
  let vendorJs = document.createElement('script');
  vendorJs.async = true;
  vendorJs.src = geonaServer + '/js/vendor.js';
  vendorJs.onload = function() {
    // When the vendorJs is loaded, add the bundleJs to the page
    vendorJsLoaded = true;
    head.appendChild(bundleJs);
  };
  head.appendChild(vendorJs);
}

let queuedConfigs = [];

/**
 * Add the provided config to the config queue, to ultimately create a Geona instance from it.
 * @param  {Object} config The Geona client config
 */
export function load(config) {
  let geonaServer = config.geonaServer || '';
  if (!geonaCoreLoading) {
    loadGeonaCore(geonaServer);
  }

  queuedConfigs.push(config);

  if (vendorJsLoaded && bundleJsLoaded) {
    createInstances();
  }
}

/**
 * Create new Geona instances from any configs currently in the queue.
 */
function createInstances() {
  while (queuedConfigs.length) {
    let config = queuedConfigs.pop();

    let geonaInstance;
    // If there is a state defined, we'll retrieve the config from the server
    if (config.state) {
      console.log(config);
      $.ajax(config.geonaServer + '/state/' + config.state,
        {
          contentType: 'application/json',
        })
        .done((response) => {
          // Update the current config options to match the state
          config.map = response.map;
          config.intro = response.intro;
          config.controls = response.controls;

          geonaInstance = new geona.Geona(config);
        })
        .fail(() => {
          geonaInstance = new geona.Geona(config);
        });

      if (config.geonaVariable) {
        window[config.geonaVariable] = geonaInstance;
      }
    } else { // Otherwise we'll just use the defaults, and any user-defined options
      geonaInstance = new geona.Geona(config);

      if (config.geonaVariable) {
        window[config.geonaVariable] = geonaInstance;
      }
    }
  }
}
