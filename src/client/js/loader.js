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
let vendorJs = document.createElement('script');
vendorJs.async = true;
vendorJs.src = 'js/vendor.js';

// Used to track whether the respective js has been loaded
let vendorJsLoaded = false;
let mapJsLoaded = false;

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

    console.log('mapJsLoaded: ' + mapJsLoaded);
    if (mapJsLoaded === true) {
      console.log('mapJsLoaded was determined to be TRUE - now in first IF statement');
      gp2.testInit(config);
    } else {
      console.log('mapJsLoaded was determined to be FALSE - now in second IF statement');
      mapJs.onload = function() {
        console.log('mapJs has loaded, and we will now call testInit');
        gp2.testInit(config);
        mapJsLoaded = true;
      };
    }

    let mapCss = document.createElement('link');

    switch (mapLibrary) {
    case 'openlayers':
      mapJs.src = 'js/bundle_openlayers.js';
      break;
    case 'leaflet':
      mapJs.src = 'js/bundle_leaflet.js';

      mapCss.rel = 'stylesheet';
      mapCss.type = 'text/css';
      mapCss.href = 'https://unpkg.com/leaflet@1.1.0/dist/leaflet.css';
      mapCss.integrity = 'sha512-wcw6ts8Anuw10Mzh9Ytw4pylW8+NAD4ch3lqm9lzAsTxg0GFeJgoAtxuCLREZSC5lUXdVyo/7yfsqFjQ4S+aKw==';
      mapCss.crossOrigin = '';
      break;
    }
    head.appendChild(mapCss);

    // We make sure the vendor js has loaded to prevent race conditions
    // However the onload will only work once - so we use the vendorJsLoaded bool
    // to allow multiple map scripts to be added.
    console.log('vendorJsLoaded: ' + vendorJsLoaded);
    if (vendorJsLoaded === true) {
      console.log('vendorJsLoaded was determined to be TRUE - now in first IF statement');
      head.appendChild(mapJs);
    } else {
      console.log('vendorJsLoaded was determined to be FALSE - now in second IF statement');
      vendorJs.onload = function() {
        head.appendChild(mapJs);
        vendorJsLoaded = true;
      };
    }
    head.appendChild(vendorJs);
  }
}
