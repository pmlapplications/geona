/* global gp2 */

// Get the head of the page
var head = document.getElementsByTagName('head')[0];

// Add the main css to the page
var mainCss = document.createElement('link');
mainCss.rel = 'stylesheet';
mainCss.type = 'text/css';
mainCss.href = 'css/main.css';
head.appendChild(mainCss);

var vendorJsLoaded = false;
var bundleJsLoaded = false;

// Define the element for the bundle js
var bundleJs = document.createElement('script');
bundleJs.async = true;
bundleJs.src = 'js/bundle.js';
bundleJs.onload = function() {
  bundleJsLoaded = true;
  addMaps();
};

// Add the vendor js to the page
var vendorJs = document.createElement('script');
vendorJs.async = true;
vendorJs.src = 'js/vendor.js';
vendorJs.onload = function() {
  vendorJsLoaded = true;
  // Add the bundle js to the page
  head.appendChild(bundleJs);
};
head.appendChild(vendorJs);

var queuedMaps = [];
var cssAdded = [];

/**
 * Loads the map js and css for the mapping library specified in the config
 */
class Loader {
  /**
   * Instantiate a loader and load the map js and css for the mapping library specified in the config
   * @param  {Object} config The config for the map
   */
  constructor(config) {
    let leafletCss;

    switch (config.mapLibrary) {
      case 'leaflet':
        leafletCss = document.createElement('link');
        leafletCss.rel = 'stylesheet';
        leafletCss.type = 'text/css';
        leafletCss.href = 'https://unpkg.com/leaflet@1.1.0/dist/leaflet.css';
        leafletCss.integrity = 'sha512-wcw6ts8Anuw10Mzh9Ytw4pylW8+NAD4ch3lqm9lzAsTxg0GFeJgoAtxuCLREZSC5lUXdVyo/7yfsqFjQ4S+aKw==';
        leafletCss.crossOrigin = '';
        head.appendChild(leafletCss);

        cssAdded.push('leaflet');
        break;
    }

    queuedMaps.push(config);

    if (vendorJsLoaded && bundleJsLoaded) {
      addMaps();
    }
  }
}

function addMaps() {
  while (queuedMaps.length) {
    let config = queuedMaps.pop();
    switch (config.mapLibrary) {
      case 'leaflet':
        gp2.initLeaflet(config);
        break;
      case 'openlayers':
        gp2.initOpenlayers(config);
    }
  }
}
