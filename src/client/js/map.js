// import * as olMap from './map_openlayers';
// import * as leafletMap from './map_leaflet';
import * as config from './config';

let map;

/**
 * Select a map library based on the config
 * @param  {Function} next Function to call when done
 */
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

/**
 * Create the map
 */
export function createMap() {
  map.createMap();
}
