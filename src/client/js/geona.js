import $ from 'jquery';
import * as templates from '../templates/compiled';
import Config from './config';
import * as leaflet from './map_leaflet';
import * as ol from './map_openlayers';

// TODO These are for testing only
window.templates = templates;
window.$ = $;

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
    this.loadMainTemplate_();

    // Get the HTMLElement div to put the map in
    let mapDiv = $(this.config.get('divId') + ' .geona-map')[0];

    // TODO this should perhaps go a in seperate init method that returns a callback or promise
    switch (this.config.get('map.library')) {
      case 'openlayers':
        ol.init(() => {
          this.map = new ol.OlMap(this.config.get('map'), mapDiv);
        });
        break;
      case 'leaflet':
        leaflet.init(() => {
          this.map = new leaflet.LMap(this.config.get('map'), mapDiv);
        });
        break;
    }
  }

  /**
   * Add the geona template underneith the parent map div in the config
   * @private
   */
  loadMainTemplate_() {
    let parentDivId = this.config.get('divId');
    let mapDivId = parentDivId + '-geona-map';
    $(parentDivId).html(templates.geona({parentDivId: parentDivId}));
  }
}
