/* global geona */

let head = document.getElementsByTagName('head')[0];

// Add Geona css to the page
let mainCss = document.createElement('link');
mainCss.rel = 'stylesheet';
mainCss.type = 'text/css';
mainCss.href = 'css/main.css';
head.appendChild(mainCss);

let vendorJsLoaded = false;
let bundleJsLoaded = false;

// Define the element for the bundle js
let bundleJs = document.createElement('script');
bundleJs.async = true;
bundleJs.src = 'js/bundle.js';
bundleJs.onload = function() {
  // When the bundleJs is loaded, call createInstances() to create Geona instances for any queued configs
  bundleJsLoaded = true;
  createInstances();
};

// Add the vendor js to the page
let vendorJs = document.createElement('script');
vendorJs.async = true;
vendorJs.src = 'js/vendor.js';
vendorJs.onload = function() {
  // When the vendorJs is loaded, add the bundleJs to the page
  vendorJsLoaded = true;
  head.appendChild(bundleJs);
};
head.appendChild(vendorJs);

let queuedConfigs = [];
// let cssAdded = [];

/**
 * Add the provided config to the config queue, to ultimately create a Geona instance from it.
 * @param  {Object} config The Geona client config
 */
export function load(config) {
  // TODO Do we need leaflet CSS anymore? Isn't it defined in our CSS now?
  // let leafletCss;
  // switch (config.mapLibrary) {
  //   case 'leaflet':
  //     leafletCss = document.createElement('link');
  //     leafletCss.rel = 'stylesheet';
  //     leafletCss.type = 'text/css';
  //     leafletCss.href = 'css/leaflet-custom.scss';

  //     cssAdded.push('leaflet');
  //     break;
  // }

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

    // TODO Set to variable specified in config? Or create and then call init? Or handle a callback? Or all of these?
    let thingy = new geona.Geona(config);
  }
}
