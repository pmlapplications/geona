/* global geona */
import $ from 'jquery';

// Get the head of the page
let head = document.getElementsByTagName('head')[0];

// Add all css from main.scss to the page
// Including custom leaflet css
// Could this cause problems if individual css files are loaded in different order?
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
  bundleJsLoaded = true;
  addMaps();
};

// Add the vendor js to the page
let vendorJs = document.createElement('script');
vendorJs.async = true;
vendorJs.src = 'js/vendor.js';
vendorJs.onload = function() {
  vendorJsLoaded = true;
  // Add the bundle js to the page
  head.appendChild(bundleJs);
};
head.appendChild(vendorJs);

let queuedMaps = [];
let cssAdded = [];

/**
 * Load the map js and css for the mapping library specified in the config
 * Commented code relating to fullscreen leaflet should be left in for now.
 * @param  {Object} config The config for the map
 */
export function load(config) {
  let leafletCss;

  switch (config.mapLibrary) {
    case 'leaflet':
      leafletCss = document.createElement('link');
      leafletCss.rel = 'stylesheet';
      leafletCss.type = 'text/css';
      leafletCss.href = 'css/leaflet-custom.scss';

      cssAdded.push('leaflet');
      break;
  }

  queuedMaps.push(config);

  /* if (vendorJsLoaded && bundleJsLoaded && leafletFullscreenJsLoaded) {*/
  if (vendorJsLoaded && bundleJsLoaded) {
    addMaps();
  }
}

/**
 * TODO Add proper comment here----
 *
 * A geonaDiv is added within the mapDivID div for every map config received.
 * This allows geona to correctly display maps, and for users to resize their maps
 * whilst retaining correct behaviour.
 */
function addMaps() {
  while (queuedMaps.length) {
    let config = queuedMaps.pop();

    // This code cannot go outside the loop, as a new element must be created
    // each time (otherwise only one is created from the whole loop)
    let geonaDiv = document.createElement('div');
    geonaDiv.className = 'geonaDiv';

    // set the unique id for this geonaDiv element
    geonaDiv.id = geonaDiv.className + config.mapDivID;
    // here put the geonaDiv element in the mapDivID element
    $('#' + config.mapDivID).append(geonaDiv);
    // here replace mapDivID with the unique geonaDiv id
    config.mapDivID = geonaDiv.id;

    let thingy = new geona.Geona(config);

    // switch (config.mapLibrary) {
    //   case 'leaflet':
    //     gp2.initLeaflet(config);
    //     break;
    //   case 'openlayers':
    //     gp2.initOpenlayers(config);
    // }
  }
}
