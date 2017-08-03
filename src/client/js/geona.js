import Config from './config';
import * as ol from './map_openlayers';
import * as leaflet from './map_leaflet';
import $ from 'jquery';

/**
 * The entry class for Geona.
 */
export class Geona {
  /**
   * Create a new Geona instance, optionally providing a client config.
   * @param  {Object} clientConfig A JSON client config.
   */
  constructor(clientConfig) {
    this.config = new Config(clientConfig);
    this.addDiv_();

    // TODO this should perhaps go a in seperate init method that returns a callback or promise
    switch (this.config.get('map.library')) {
      case 'openlayers':
        ol.init(() => {
          this.map = new ol.OlMap(this.config.get('map'));
        });
        break;
      case 'leaflet':
        leaflet.init(() => {
          this.map = new leaflet.LMap(this.config.get('map'));
        });
        break;
    }
  }

  /**
   * Add our geona div underneith the parent map div in the config
   * @private
   */
  addDiv_() {
    let parentDivId = this.config.get('map.divId');
    let geonaDiv = document.createElement('div');
    geonaDiv.className = 'geona';

    // Set the unique id for this geonaDiv element
    geonaDiv.id = parentDivId + '-' + geonaDiv.className;

    // Add our div to the parent div
    $('#' + parentDivId).append(geonaDiv);

    // Set our new div as the map div in the config
    this.config.set('map.divId', geonaDiv.id);
  }
}
