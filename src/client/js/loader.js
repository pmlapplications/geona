let mapLibrary = window.gp2_config.mapLibrary;

let script = document.createElement('script');
script.async = true;

let mainCss = document.createElement('link');
mainCss.rel = 'stylesheet';
mainCss.type = 'text/css';
mainCss.href = 'css/main.css';

let mapCss = document.createElement('link');
mapCss.rel = 'stylesheet';
mapCss.type = "text/css";

let head= document.getElementsByTagName('head')[0];

switch(mapLibrary) {
case 'openlayers':
  script.src = 'js/bundle_openlayers.js';
  break;
case 'leaflet':
  script.src = 'js/bundle_leaflet.js';
  mapCss.href = 'https://unpkg.com/leaflet@1.1.0/dist/leaflet.css';
  mapCss.integrity = 'sha512-wcw6ts8Anuw10Mzh9Ytw4pylW8+NAD4ch3lqm9lzAsTxg0GFeJgoAtxuCLREZSC5lUXdVyo/7yfsqFjQ4S+aKw==';
  head.appendChild(mapCss);
  break;
}


head.appendChild(script);
head.appendChild(mainCss);


