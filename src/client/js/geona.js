import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';

import * as templates from '../templates/compiled';
import Config from './config';
import * as leaflet from './map_leaflet';
import * as ol from './map_openlayers';
import {initI18n} from './i18n';
// import {GeonaLayer} from './layer';
import {Gui} from './gui/gui';

// TODO These are for testing only
window.templates = templates;
window.$ = $;
// window.GeonaLayer = GeonaLayer;

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
    this.layerNames = [];
    this.gui = new Gui(this);
    this.geonaServer = this.config.get('geonaServer');

    // Initialize i18n and then the GUI
    initI18n(this.geonaServer).then(() =>{
      this.gui.init(() => {
        if (this.config.get('onReadyCallback')) {
          // If a onReadyCallback is defined in the config, try to call it
          try {
            window[this.config.get('onReadyCallback')](this);
          } catch (e) {
            console.error('Failed to call onReadyCallback: ' + e);
          }
        }
      });
    });
  }

  /**
   * Load the map into the provided div.
   * @param  {HTMLElement} mapDiv The HTML element to put the map in
   * @return {Promise}     Promise that resolves when the map has been loaded
   */
  loadMap(mapDiv) {
    return new Promise((resolve) => {
      switch (this.config.get('map.library')) {
        case 'openlayers':
          ol.init(this.geonaServer, () => {
            this.map = new ol.OlMap(this.config.get('map'), mapDiv);
            resolve();
          });
          break;
        case 'leaflet':
          leaflet.init(this.geonaServer, () => {
            this.map = new leaflet.LMap(this.config.get('map'), mapDiv);
            resolve();
          });
          break;
      }
    });
  }
}
