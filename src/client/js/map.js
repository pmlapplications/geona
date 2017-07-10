// import * as olMap from './map_openlayers';
// import * as leafletMap from './map_leaflet';
import * as config from './config';

let map;

export function chooseLibrary(next) {
  if (config.get('mapLibrary') === 'openlayers') {
    import('./map_openlayers')
    .then((olMap) => {
      map = olMap;
      next();
    });
  } else if (config.get('mapLibrary') === 'leaflet') {
    import('./map_leaflet')
    .then((leafletMap) => {
      map = leafletMap;
      next();
    });
  }
}

export function createMap() {
  map.createMap();
}
