/* global gp2 */


// Get the head of the page
let head = document.getElementsByTagName('head')[0];

// Add the main css to the page
let mainCss = document.createElement('link');
mainCss.rel = 'stylesheet';
mainCss.type = 'text/css';
mainCss.href = 'css/main.css';
head.appendChild(mainCss);

// Add the vendor js to the page
let vendorJsLoaded = false;
let vendorJs = document.createElement('script');
vendorJs.async = true;
vendorJs.src = 'js/vendor.js';
vendorJs.onload = function() {
  vendorJsLoaded = true;
  addMapScripts();
};
head.appendChild(vendorJs);

let queuedMapScripts = [];
let scriptsAdded = [];
let cssAdded = [];

/**
 * Loads the map js and css for the mapping library specified in the config
 */
export class Loader {
  /**
   * Instantiate a loader and load the map js and css for the mapping library specified in the config
   * @param  {Object} config The config for the map
   */
  constructor(config) {
    let mapLibrary = config.mapLibrary;

    let mapJs = document.createElement('script');
    // mapJs.async = true;
    mapJs.type = 'text/javascript';

    mapJs.onload = function() {
      gp2.testInit(config);
    };

    let mapCss = document.createElement('link');

    switch (mapLibrary) {
      case 'openlayers':
        // if (scriptsAdded.includes('openlayers')) {
        //   return;
        // }
        mapJs.src = 'js/bundle_openlayers.js';
        scriptsAdded.push('openlayers');
        break;
      case 'leaflet':
        mapJs.src = 'js/bundle_leaflet.js';

        mapCss.rel = 'stylesheet';
        mapCss.type = 'text/css';
        mapCss.href = 'https://unpkg.com/leaflet@1.1.0/dist/leaflet.css';
        mapCss.integrity = 'sha512-wcw6ts8Anuw10Mzh9Ytw4pylW8+NAD4ch3lqm9lzAsTxg0GFeJgoAtxuCLREZSC5lUXdVyo/7yfsqFjQ4S+aKw==';
        mapCss.crossOrigin = '';

        scriptsAdded.push('leaflet');
        cssAdded.push('openlayers');
        break;
    }
    head.appendChild(mapCss);

    if (vendorJsLoaded) {
      head.appendChild(mapJs);
    } else {
      queuedMapScripts.push(mapJs);
    }
  }
}

function addMapScripts() {
  for (let mapScript of queuedMapScripts) {
    head.appendChild(mapScript);
  }
}
