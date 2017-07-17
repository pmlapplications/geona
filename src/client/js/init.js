// import {loadConfig} from './config';
import * as ol from './map_openlayers';
import * as leaflet from './map_leaflet';

class Init {
  /**
   * @param {*} map
   * @param {*} config
   */
  constructor(map, config) {
    map.init(() => {
      map.createMap(config);
    });

    // loadConfig(() => {
    //   map.createMap(config);
    // });
    // console.log($('#' + config.mapDivID).length);
    // $('#' + config.mapDivID).append('<div class="gp2_map"></div>');
  }

  /**
   * Appends a new div into the div defined in the config
   * This is so that we can style the new div to ensure the mapghghgh
   * displays correctly, and the user can style their specified
   * div as they desire.
   */
  // I could not get this working, but I think keeping these functions separate is a good idea
  // insertGP2Div(config) {


  // }
}

export function initLeaflet(config) {
  // console.log('testInit called for Leaflet');
  let lintHappy = new Init(leaflet, config);
}

export function initOpenlayers(config) {
  console.log('testInit called for OpenLayers');
  let lintHappy = new Init(ol, config);
}
