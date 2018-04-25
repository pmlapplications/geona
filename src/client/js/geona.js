/** @module geona */

import $ from 'jquery';

import * as templates from '../templates/compiled';
import Config from './config';
import * as leaflet from './map_leaflet';
import * as ol from './map_openlayers';
import { initI18n } from './i18n';
import { Gui } from './gui/gui';
import { EventManager } from '../../common/event_manager';

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

    // Get the Geona div and add the 'geona-container' class to it
    this.geonaDiv = $(this.config.get('divId'));
    this.geonaDiv.toggleClass('geona-container', true);
    // Adding a tabindex makes the div selectable as an activeElement - required for instance-specific keyboard commands
    this.geonaDiv.attr('tabindex', 0);

    this.eventManager = new EventManager();
    this.gui = new Gui(this);
    this.geonaServer = this.config.get('geonaServer');

    // Initialize i18n and then the GUI
    initI18n(this.geonaServer).then(() => {
      this.gui.init(() => {
        let onReadyCallback = this.config.get('onReadyCallback');
        if (onReadyCallback) {
          // If a onReadyCallback is defined in the config, try to call it
          try {
            // TODO add support for onReadyCallback being a function instead of a string
            // so that the function can just be called, else we assume it's attached to the window
            window[onReadyCallback](this);
          } catch (e) {
            console.error('Failed to call onReadyCallback: ' + e);
          }
        }
        this.eventManager.trigger('map.initialized');
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
            this.map = new ol.OlMap(this.config.get('map'), mapDiv, this);
            resolve();
          });
          break;
        case 'leaflet':
          leaflet.init(this.geonaServer, () => {
            this.map = new leaflet.LMap(this.config.get('map'), mapDiv, this);
            resolve();
          });
          break;
      }
    });
  }
}
