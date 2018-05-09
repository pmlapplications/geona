/** @module geona */

import $ from 'jquery';

import * as templates from '../templates/compiled';
import Config from './config';
import * as leaflet from './map_leaflet';
import * as ol from './map_openlayers';
import {initI18n} from './i18n';
import {Gui} from './gui/gui';
import {EventManager} from '../../common/event_manager';

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
   * @param {Object} [clientConfig] A JSON client config.
   */
  constructor(clientConfig) {
    this.config = new Config(clientConfig);
    this.layerNames = [];

    // Get the Geona div and add the 'geona-container' class to it
    /** @type {JQuery} */
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

  /**
   * Saves the necessary options to recreate an instance of Geona in an identical form as when the method was called.
   * This includes (but is not limited to) the layers on the map, the available layers, the current zoom and extent, and
   * the GUI panels which are open.
   */
  saveGeonaState() {
    // Compiles all required options into a config Object
    let geonaState = {};

    // Map options
    geonaState.map = this.map.config;

    // GUI options
    geonaState.intro = this.config.get('intro');

    geonaState.controls = {};
    geonaState.controls.timeline = this.gui.timePanel.config;
    geonaState.controls.menu = this.gui.mainMenu.config;

    console.log(geonaState); // removeme

    // Save the state into the browser cache (or database?)
    this.geonaSaveState = JSON.stringify(geonaState); // TODO put this in the cache
  }

  /**
   * Alters the map and GUI to match the state as it was in the specified Geona state.
   * @param {String} geonaStateJson A stringified JSON Geona config containing map, controls and intro settings.
   */
  loadGeonaState(geonaStateJson) {
    let geonaState = JSON.parse(geonaStateJson);

    this.map = undefined;
    this.gui = undefined;
    this.eventManager = undefined;

    // TODO merge the configs (e.g. data layers)


    // Update the config
    this.config.set('map', geonaState.map);
    this.config.set('intro', geonaState.intro);
    this.config.set('controls', geonaState.controls);

    this.geonaDiv.empty();
    this.geonaDiv.removeClass();
    this.geonaDiv.removeAttr('tabindex');
    // this.geonaDiv.removeAttr('style');

    //
    this.layerNames = [];

    // Get the Geona div and add the 'geona-container' class to it
    /** @type {JQuery} */
    // this.geonaDiv = $(this.config.get('divId'));
    this.geonaDiv.toggleClass('geona-container', true);
    // Adding a tabindex makes the div selectable as an activeElement - required for instance-specific keyboard commands
    this.geonaDiv.attr('tabindex', 0);

    this.eventManager = new EventManager();
    this.gui = new Gui(this);
    // this.geonaServer = this.config.get('geonaServer');
    //

    // this.gui = new Gui(this);

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
  }
}
