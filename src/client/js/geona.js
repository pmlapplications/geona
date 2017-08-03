import $ from 'jquery';
import * as templates from '../templates/compiled';
import Config from './config';
import * as leaflet from './map_leaflet';
import * as ol from './map_openlayers';

window.templates = templates;

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
    this.loadTemplate_();

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
   * Add the geona template underneith the parent map div in the config
   * @private
   */
  loadTemplate_() {
    let parentDivId = this.config.get('map.divId');
    let geonaDivId = 'geona-' + parentDivId;
    $('#' + parentDivId).html(templates.geona({parentDivId: parentDivId}));
    this.config.set('map.divId', geonaDivId);
  }
}
