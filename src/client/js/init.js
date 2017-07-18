// import {loadConfig} from './config';
import * as ol from './map_openlayers';
import * as leaflet from './map_leaflet';

function init(map, config) {
  map.init(() => {
    map.createMap(config);
  });


  // constructor(map, config) {
  //   map.init(() => {
  //     map.createMap(config);
  //   });

  // loadConfig(() => {
  //   map.createMap(config);
  // });
  // console.log($('#' + config.mapDivID).length);
  // $('#' + config.mapDivID).append('<div class="gp2_map"></div>');
  // }
}

export function initLeaflet(config) {
  init(leaflet, config);
}

export function initOpenlayers(config) {
  init(ol, config);
}
