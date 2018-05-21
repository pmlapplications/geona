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

    // Get the Geona div and add the 'geona-container' class to it
    /** @type {JQuery} */
    this.geonaDiv = $(this.config.get('divId'));
    this.geonaDiv.toggleClass('geona-container', true);
    // Adding a tabindex makes the div selectable as an activeElement - required for instance-specific keyboard commands
    this.geonaDiv.attr('tabindex', 0);

    this.eventManager = new EventManager();

    // Set a flag for loading initial menu - this is used in MainMenu to stop the config getting overwritten on init
    this.loadingInitialMenu = true;

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
   * Saves the current Geona config options as an Object in the browser localStorage.
   */
  saveGeonaStateToBrowser() {
    // Gets the current Geona state as an Object
    let geonaState = this._saveGeonaState();

    // Construct a key for this instance's localStorage save (e.g. '#geona_geona-state') if not already constructed
    if (!this.browserStorageKey) { // todo if the div ID has changed, this should be deleted and re-saved as the new divID
      this.browserStorageKey = this.config.get('divId') + '_geona-state';
    }
    // Stores a stringified version of the Geona state Object in the browser localStorage
    window.localStorage.setItem(this.browserStorageKey, JSON.stringify(geonaState));
  }

  /**
   * Saves the necessary options to recreate an instance of Geona in an identical form as when the method was called.
   * This includes (but is not limited to) the layers on the map, the available layers, the current zoom and extent, and
   * the GUI panels which are open.
   * @return {Object} The current instance's config state for the 'map', 'intro' and 'controls' sections of the config.
   * @private
   */
  _saveGeonaState() {
    // Holds all required options into a config Object
    let geonaState = {};

    // Map options
    geonaState.map = this.map.config;

    // GUI options
    geonaState.intro = this.config.get('intro');

    geonaState.controls = {};
    geonaState.controls.timeline = this.gui.timePanel.config;
    geonaState.controls.menu = this.gui.mainMenu.config;

    // Infinity will get converted to null when stringified so we need to check all the viewSettings and sanitize them
    for (let basemapServer of geonaState.map.basemapLayers) {
      if (basemapServer.layers) {
        for (let basemap of basemapServer.layers) {
          if (basemap.viewSettings && basemap.viewSettings.maxExtent) {
            if (basemap.viewSettings.maxExtent.minLon === -Infinity) {
              basemap.viewSettings.maxExtent.minLon = 'sanitized.-Infinity';
            }
          }
          if (basemap.viewSettings && basemap.viewSettings.maxExtent) {
            if (basemap.viewSettings.maxExtent.maxLon === Infinity) {
              basemap.viewSettings.maxExtent.maxLon = 'sanitized.Infinity';
            }
          }
        }
      }
    }
    for (let bordersServer of geonaState.map.bordersLayers) {
      if (bordersServer.layers) {
        for (let borders of bordersServer.layers) {
          if (borders.viewSettings && borders.viewSettings.maxExtent) {
            if (borders.viewSettings.maxExtent.minLon === -Infinity) {
              borders.viewSettings.maxExtent.minLon = 'sanitized.-Infinity';
            }
          }
          if (borders.viewSettings && borders.viewSettings.maxExtent) {
            if (borders.viewSettings.maxExtent.maxLon === Infinity) {
              borders.viewSettings.maxExtent.maxLon = 'sanitized.Infinity';
            }
          }
        }
      }
    }
    for (let dataServer of geonaState.map.dataLayers) {
      if (dataServer.layers) {
        for (let data of dataServer.layers) {
          if (data.viewSettings && data.viewSettings.maxExtent) {
            if (data.viewSettings.maxExtent.minLon === -Infinity) {
              data.viewSettings.maxExtent.minLon = 'sanitized.-Infinity';
            }
          }
          if (data.viewSettings && data.viewSettings.maxExtent) {
            if (data.viewSettings.maxExtent.maxLon === Infinity) {
              data.viewSettings.maxExtent.maxLon = 'sanitized.Infinity';
            }
          }
        }
      }
    }
    if (geonaState.map.viewSettings.maxExtent.minLon === -Infinity) {
      geonaState.map.viewSettings.maxExtent.minLon = 'sanitized.-Infinity';
    }
    if (geonaState.map.viewSettings.maxExtent.maxLon === Infinity) {
      geonaState.map.viewSettings.maxExtent.maxLon = 'sanitized.Infinity';
    }

    // Return the Geona state Object
    return geonaState;
  }

  /**
   * Loads the Geona state that was most recently saved for this instance from the browser localStorage.
   */
  loadGeonaStateFromBrowser() {
    // Will recreate the browserStorageKey if not kept from previous instantiation
    // todo save the browserStorageKey to the config - will allow access to the previous map even if div ID changes
    if (!this.browserStorageKey) {
      this.browserStorageKey = this.config.get('divId') + '_geona-state';
    }
    let geonaStateJson = window.localStorage.getItem(this.browserStorageKey);
    this._loadGeonaState(geonaStateJson);
  }

  /**
   * Alters the map and GUI to match the state as it was in the specified Geona state.
   * @param {String} geonaStateJson A stringified JSON Geona config containing map, controls and intro settings.
   * @private
   */
  _loadGeonaState(geonaStateJson) {
    let geonaState = JSON.parse(geonaStateJson);

    // Infinity will get converted to null when stringified so we need to check all the viewSettings and unsanitize them
    for (let basemapServer of geonaState.map.basemapLayers) { // All layers for each basemap server
      if (basemapServer.layers) {
        for (let basemap of basemapServer.layers) {
          if (basemap.viewSettings && basemap.viewSettings.maxExtent) {
            if (basemap.viewSettings.maxExtent.minLon === 'sanitized.-Infinity') {
              basemap.viewSettings.maxExtent.minLon = -Infinity;
            }
          }
          if (basemap.viewSettings && basemap.viewSettings.maxExtent) {
            if (basemap.viewSettings.maxExtent.maxLon === 'sanitized.Infinity') {
              basemap.viewSettings.maxExtent.maxLon = Infinity;
            }
          }
        }
      }
    }
    for (let bordersServer of geonaState.map.bordersLayers) { // All layers for each borders server
      if (bordersServer.layers) {
        for (let borders of bordersServer.layers) {
          if (borders.viewSettings && borders.viewSettings.maxExtent) {
            if (borders.viewSettings.maxExtent.minLon === 'sanitized.-Infinity') {
              borders.viewSettings.maxExtent.minLon = -Infinity;
            }
          }
          if (borders.viewSettings && borders.viewSettings.maxExtent) {
            if (borders.viewSettings.maxExtent.maxLon === 'sanitized.Infinity') {
              borders.viewSettings.maxExtent.maxLon = Infinity;
            }
          }
        }
      }
    }
    for (let dataServer of geonaState.map.dataLayers) { // All layers for each data server
      if (dataServer.layers) {
        for (let data of dataServer.layers) {
          if (data.viewSettings && data.viewSettings.maxExtent) {
            if (data.viewSettings.maxExtent.minLon === 'sanitized.-Infinity') {
              data.viewSettings.maxExtent.minLon = -Infinity;
            }
          }
          if (data.viewSettings && data.viewSettings.maxExtent) {
            if (data.viewSettings.maxExtent.maxLon === 'sanitized.Infinity') {
              data.viewSettings.maxExtent.maxLon = Infinity;
            }
          }
        }
      }
    }
    // Main map view settings
    if (geonaState.map.viewSettings.maxExtent.minLon === 'sanitized.-Infinity') {
      geonaState.map.viewSettings.maxExtent.minLon = -Infinity;
    }
    if (geonaState.map.viewSettings.maxExtent.maxLon === 'sanitized.Infinity') {
      geonaState.map.viewSettings.maxExtent.maxLon = Infinity;
    }

    // Reset the Geona variables ready for recreation
    this.map = undefined;
    this.gui = undefined;
    this.eventManager = undefined;

    // Merge the configs for layers
    let currentMapConfig = this.config.get('map');
    // Remove duplicate layers from the current instance's config
    for (let basemapLayer of geonaState.map.basemapLayers) {
      for (let i = 0; i < currentMapConfig.basemapLayers.length; i++) {
        let currentConfigBasemapLayer = currentMapConfig.basemapLayers[i];
        if (currentConfigBasemapLayer.identifier === basemapLayer.identifier) {
          currentMapConfig.basemapLayers.splice(i, 1);
          i--;
        }
      }
    }
    for (let bordersLayer of geonaState.map.bordersLayers) {
      for (let i = 0; i < currentMapConfig.bordersLayers.length; i++) {
        let currentConfigBordersLayer = currentMapConfig.bordersLayers[i];
        if (currentConfigBordersLayer.identifier === bordersLayer.identifier) {
          currentMapConfig.bordersLayers.splice(i, 1);
          i--;
        }
      }
    }
    for (let dataLayer of geonaState.map.dataLayers) {
      for (let i = 0; i < currentMapConfig.dataLayers.length; i++) {
        let currentConfigDataLayer = currentMapConfig.dataLayers[i];
        if (currentConfigDataLayer.identifier === dataLayer.identifier) {
          currentMapConfig.dataLayers.splice(i, 1);
          i--;
        }
      }
    }

    // Now that duplicates have been removed, add the remaining layers to the state's available layers
    for (let basemapLayer of currentMapConfig.basemapLayers) {
      geonaState.map.basemapLayers.push(basemapLayer);
    }
    for (let bordersLayer of currentMapConfig.bordersLayers) {
      geonaState.map.bordersLayers.push(bordersLayer);
    }
    for (let dataLayer of currentMapConfig.dataLayers) {
      geonaState.map.dataLayers.push(dataLayer);
    }

    // Update the config
    this.config.set('map', geonaState.map);
    this.config.set('intro', geonaState.intro);
    this.config.set('controls', geonaState.controls);

    // Empty the Geona div so the current Map and GUI are now completely removed
    this.geonaDiv.empty();

    // Removes classes and attributes added later in the process
    this.geonaDiv.removeClass(); // todo not sure if need to remove (pretty sure we don't)
    this.geonaDiv.removeAttr('tabindex'); // todo do we need to remove this? I don't think we do. Test when loading from state works
    // this.geonaDiv.removeAttr('style');

    this.geonaDiv.toggleClass('geona-container', true);
    // Adding a tabindex makes the div selectable as an activeElement - required for instance-specific keyboard commands
    this.geonaDiv.attr('tabindex', 0);

    // Instantiate a new event manager (prevents triggers from being set twice)
    this.eventManager = new EventManager();

    // Set a flag for loading initial menu - this is used in MainMenu to stop the config getting overwritten on init
    this.loadingInitialMenu = true;
    // Instantiate a new GUI
    this.gui = new Gui(this);

    // Call init in order to instantiate a new Map
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
