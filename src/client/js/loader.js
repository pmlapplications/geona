let mapLibrary = window.gp2_config.mapLibrary;

let script = document.createElement('script');
script.async = true;

switch(mapLibrary) {
case 'openlayers':
  script.src = 'js/bundle_openlayers.js';
  break;
case 'leaflet':
  script.src = 'js/bundle_leaflet.js';
  break;
}

let head= document.getElementsByTagName('head')[0];
head.appendChild(script);
