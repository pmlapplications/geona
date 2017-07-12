// head refers to the head element of index.hbs
let head= document.getElementsByTagName('head')[0];

// define the main CSS rules which all maps will use
let mainCss = document.createElement('link');
mainCss.rel = 'stylesheet';
mainCss.type = 'text/css';
mainCss.href = 'css/main.css';

head.appendChild(mainCss);

/**
 * Loads a map library and css for the mapping library passed
 */
export class Loader {
  constructor(config){
    let mapLibrary = config.mapLibrary;

    let script = document.createElement('script');
    script.async = true;

    switch(mapLibrary) {
    case 'openlayers':
      script.src = 'js/bundle_openlayers.js';
      break;
    case 'leaflet':
      script.src = 'js/bundle_leaflet.js';
      let leafletCss = document.createElement('link');
      leafletCss.rel = 'stylesheet';
      leafletCss.type = "text/css";
      leafletCss.href = 'https://unpkg.com/leaflet@1.1.0/dist/leaflet.css';
      leafletCss.integrity = 'sha512-wcw6ts8Anuw10Mzh9Ytw4pylW8+NAD4ch3lqm9lzAsTxg0GFeJgoAtxuCLREZSC5lUXdVyo/7yfsqFjQ4S+aKw==';
      head.appendChild(leafletCss);
      break;
    }
    head.appendChild(script);
  }
}