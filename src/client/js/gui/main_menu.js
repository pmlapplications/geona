import 'jquery';
import moment from 'moment';
import * as templates from '../../templates/compiled';
import {registerTriggers} from './main_menu_triggers';
import {registerBindings} from './main_menu_bindings';

import {selectPropertyLanguage, getLayerServer, urlInCache} from '../map_common';
import {setTimeout} from 'timers';

/**
 * Loads the templates and defines the functions relating to the main menu.
 */
export class MainMenu {
  /**
   * Creates an instance of a MainMenu element to put on the GUI.
   * @param {Gui} gui                The parent Gui of this MainMenu.
   * @param {Object} menuConfigOptions The config settings relating to the main menu.
   */
  constructor(gui, menuConfigOptions) {
    this.gui = gui;
    this.geona = gui.geona;
    this.config = menuConfigOptions;
    this.parentDiv = gui.parentDiv;

    // requestLayers holds the layers found for the most recent WMS/WMTS request
    this.requestLayers = [];
    // layersBoxList holds the order of the layers in the layers list
    this.layersBoxList = [];

    // Sets up menu toggle control
    if (this.config.collapsible) {
      this.parentDiv.find('.js-geona-menu-bar').append(templates.menu_toggle());
    }

    // Sets up menu
    this.parentDiv.find('.js-geona-menu-bar').append(templates.menu());
    this.parentDiv.find('.js-geona-menu')
      .addClass('hidden')
      .append(templates.panel());
    this.parentDiv.find('.js-geona-panel').addClass('hidden');
    if (this.config.opened) {
      this.parentDiv.find('.js-geona-menu').removeClass('hidden');
      this.parentDiv.find('.js-geona-menu-toggle__icon')
        .removeClass('icon-arrow-65')
        .addClass('icon-arrow-66');
      this.parentDiv.find('.js-geona-menu-toggle__text-open').addClass('hidden');
      this.parentDiv.find('.js-geona-menu-toggle__text-close').removeClass('hidden');
    }

    // Sets the triggers and bindings for this Menu.
    registerTriggers(this.gui.eventManager, this.parentDiv);
    registerBindings(this.gui.eventManager, this);
  }

  /**
   * Makes menu visible.
   */
  openMenu() {
    this.parentDiv.find('.js-geona-menu').removeClass('hidden');
    this.parentDiv.find('.js-geona-menu-toggle__icon')
      .removeClass('icon-arrow-65')
      .addClass('icon-arrow-66');
    this.parentDiv.find('.js-geona-menu-toggle__text-open').addClass('hidden');
    this.parentDiv.find('.js-geona-menu-toggle__text-close').removeClass('hidden');
  }

  /**
   * Removes menu from the GUI, but not from the DOM.
   */
  closeMenu() {
    this.parentDiv.find('.js-geona-menu').addClass('hidden');
    this.parentDiv.find('.js-geona-menu-toggle__icon')
      .removeClass('icon-arrow-66')
      .addClass('icon-arrow-65');
    this.parentDiv.find('.js-geona-menu-toggle__text-close').addClass('hidden');
    this.parentDiv.find('.js-geona-menu-toggle__text-open').removeClass('hidden');
  }

  /**
   * Removes panel element from the GUI, but not from the DOM.
   */
  closePanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-panel').addClass('hidden');
  }

  /* ------------------------------------*\
      Explore Panel
  \* ------------------------------------*/

  /**
   * Shows the explore panel.
   */
  displayExplorePanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__explore').addClass('geona-menu__tab--active');

    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');
    this.parentDiv.find('.js-geona-panel').prepend(templates.explore_panel());

    // Leaflet doesn't support WMTS, so we will remove it from the Leaflet options
    if (this.geona.map.config.library.toLocaleLowerCase() === 'leaflet') {
      this.parentDiv.find('.js-geona-explore-panel-content__service option[value="WMTS"]').remove();
    }

    // Populate available layers dropdown
    for (let layerIdentifier of Object.keys(this.geona.map._availableLayers)) {
      let layer = this.geona.map._availableLayers[layerIdentifier];
      if (layer.modifier !== 'basemap' && layer.modifier !== 'borders') {
        this.parentDiv.find('.js-geona-explore-panel-content__available-layers').append(
          '<option value="' + layerIdentifier + '">' + layerIdentifier + ' - ' + selectPropertyLanguage(layer.title) + '</option>'
        );
      }
    }
  }

  /**
   * Automatically changes the service dropdown option based on the content of the URL
   * @param {String} url The URL currently in the input box
   */
  autoselectService(url) {
    // Regex for case-insensitive 'wms', 'wmts'
    let result = /((w|W)(m|M)(s|S))|((w|W)(m|M)(t|T)(s|S))/.exec(url);
    if (result !== null) {
      switch (result[0].toLocaleLowerCase()) {
        case 'wms':
          this.parentDiv.find('.js-geona-explore-panel-content__service').val('WMS').prop('selected', true);
          break;
        case 'wmts':
          if (this.parentDiv.find('.js-geona-explore-panel-content__service option[value="WMTS"]').length === 1) {
            this.parentDiv.find('.js-geona-explore-panel-content__service').val('WMTS').prop('selected', true);
          }
          break;
      }
    }
  }

  /**
   * If the file has been cached already, inform the user and offer ability to find layers from cached version
   * @param {String} url The contents of the URL input box
   */
  scanCache(url) {
    // Disable button and inform user of cache scan
    this.parentDiv.find('.js-geona-explore-panel-content__add-url').prop('disabled', true);
    this.parentDiv.find('.js-geona-explore-panel-content__cache-checking').removeClass('hidden');

    // Timeout in case cache check takes a long time (more than 3s)
    setTimeout(() => {
      // Re-enable button
      this.parentDiv.find('.js-geona-explore-panel-content__add-url').prop('disabled', false);
      this.parentDiv.find('.js-geona-explore-panel-content__cache-checking').addClass('hidden');
    }, 3000);

    urlInCache(url)
      .then((inCache) => {
        // Re-enable button
        this.parentDiv.find('.js-geona-explore-panel-content__add-url').prop('disabled', false);
        this.parentDiv.find('.js-geona-explore-panel-content__cache-checking').addClass('hidden');

        if (inCache === true) {
          // Show the label and checkbox
          this.parentDiv.find('.js-geona-explore-panel-content__cache-notification').removeClass('hidden');
          this.parentDiv.find('.js-geona-explore-panel-content__cache-checkbox').removeClass('hidden');
        } else {
          this.parentDiv.find('.js-geona-explore-panel-content__cache-notification').addClass('hidden');
          this.parentDiv.find('.js-geona-explore-panel-content__cache-checkbox').addClass('hidden');
        }
      });
  }

  /**
   * Populates a dropdown list for layers found from any supported service.
   * @param {String}  url      The URL for a server
   * @param {String}  service  The type of service being used (e.g. 'WMS')
   * @param {Boolean} save     Whether to save the LayerServer to cache
   * @param {Boolean} useCache Whether to use a cached copy of the LayerServer
   */
  getLayerServer(url, service, save, useCache) {
    this._clearPreviousUrlLayers();
    getLayerServer(url, service, save, useCache)
      .then((layers) => {
        this.parentDiv.find('.js-geona-explore-panel-content__layer-select').removeClass('hidden');
        this.parentDiv.find('.js-geona-explore-panel-content__add-layer').removeClass('hidden');
        let dropdown = this.parentDiv.find('.js-geona-explore-panel-content__layer-select');
        for (let layer of layers.layers) {
          dropdown.append('<option value="' + layer.identifier + '">' + layer.identifier + '</option>');
        }
        this.requestLayerServer = layers;
      }).catch((err) => {
        alert('No layers found. Error: ' + JSON.stringify(err));
      });
  }

  /**
 * Checks whether there are already layers in the dropdown from a getLayersFromWms/Wmts call, and removes them if so.
 */
  _clearPreviousUrlLayers() {
    let previousUrlLayersFound = this.parentDiv.find('.js-geona-explore-panel-content__layer-select').contents().length > 0;
    if (previousUrlLayersFound === true) {
      this.parentDiv.find('.js-geona-explore-panel-content__layer-select').empty().addClass('hidden');
      this.parentDiv.find('.js-geona-explore-panel-content__add-layer').addClass('hidden');
      // Clears the array and removes all references to its previous values
      this.requestLayerServer = undefined;
    }
  }

  /**
   * Adds the layer in the 'layer-select' input box to the map.
   * @param {String} layerIdentifier The identifier for the layer in the input box
   */
  addUrlLayerToMap(layerIdentifier) {
    let layerServerDeepCopy = JSON.parse(JSON.stringify(this.requestLayerServer));
    for (let layer of layerServerDeepCopy.layers) {
      if (layer.identifier === layerIdentifier) {
        if (layer.dimension) {
          if (layer.dimension.time) {
            this.geona.map.addLayer(layer, layerServerDeepCopy, {modifier: 'hasTime'});
          } else {
            this.geona.map.addLayer(layer, layerServerDeepCopy);
          }
        } else {
          this.geona.map.addLayer(layer, layerServerDeepCopy);
        }
      }
    }
  }

  /**
   * Adds the layer in the 'available-layers' input box to the map.
   * @param {String} layerIdentifier The layer identifier for a Geona layer
   */
  addAvailableLayerToMap(layerIdentifier) {
    let layer = this.geona.map._availableLayers[layerIdentifier];
    let layerServer = this.geona.map._availableLayerServers[layer.layerServer];
    if (layer.modifier === 'hasTime') {
      this.geona.map.addLayer(layer, layerServer, {modifier: 'hasTime'});
    } else {
      this.geona.map.addLayer(layer, layerServer);
    }
  }

  /**
   * Removes the layer specified in the item from the map
   * @param {HTMLElement} item The list element that contains the element that was clicked.
   */
  removeLayer(item) {
    this.geona.map.removeLayer(item.dataset.identifier);
    // Returns true if browser is Internet Explorer 11
    let isIE11 = Boolean(window.MSInputMethodContext) && Boolean(document.documentMode);
    if (isIE11 === true) {
      item.removeNode(true);
    } else {
      item.remove();
    }
  }

  /**
   * Hides the layer specified in the item
   * @param {HTMLElement} item The list element that contains the element that was clicked.
   */
  hideLayer(item) {
    // TODO change icon to 'hide' instead of 'preview-1'
    // item.classList.remove('icon-preview-1');
    // item.classList.add('icon-hide');
    this.geona.map.hideLayer(item.dataset.identifier);
  }

  /**
   * Shows the layer specified in the item
   * @param {HTMLElement} item The list element that contains the element that was clicked.
   */
  showLayer(item) {
    // TODO change icon to 'preview-1' instead of 'hide'
    // item.classList.remove('icon-hide');
    // item.classList.add('icon-preview-1');
    this.geona.map.showLayer(item.dataset.identifier);
  }

  /**
   * Clears current panel content and adds layers currently on map to the list of layers.
   */
  displayLayersPanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__layers').addClass('geona-menu__tab--active');

    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');

    this.parentDiv.find('.js-geona-panel').prepend(templates.layers_panel());

    let activeLayersKeys = Object.keys(this.geona.map._activeLayers);
    // Double loop used to find the zIndex of a layer so the list can be populated correctly
    for (let index = 0; index < activeLayersKeys.length; index++) {
      // Loop through the active layers on the map and populate the layers list
      for (let activeLayerKey of activeLayersKeys) {
        let modifier = this.geona.map._layerGet(activeLayerKey, 'modifier');
        let zIndex = this.geona.map._layerGet(activeLayerKey, 'zIndex');
        if (modifier !== 'basemap' && modifier !== 'borders' && zIndex === index) {
          // Get the data in the correct format from the geona layer
          let data = _compileLayerInformation(this.geona.map._availableLayers[activeLayerKey]);
          // Insert layer data object at the top of the list - higher on the list means higher on the map
          this.parentDiv.find('.js-geona-layers-list').prepend(templates.layers_panel_item({data: data}));
        }
      }
    }

    this.layersBoxList.length = 0;
    for (let layerBox of this.parentDiv.find('.js-geona-layers-list').children()) {
      this.layersBoxList.unshift(layerBox.dataset.identifier);
    }
  }

  /**
   * Reorders the map layers. Also recreates the layersBoxList array to match the current ul list of elements
   * @param {HTMLElement} item The item that was dragged and dropped.
   */
  reorderLayers(item) {
    // Reset the list
    this.layersBoxList.length = 0;
    // Repopulate the list
    for (let layerBox of this.parentDiv.find('.js-geona-layers-list').children()) {
      this.layersBoxList.unshift(layerBox.dataset.identifier);
    }

    let basemapActive = false;
    for (let layerIdentifier of Object.keys(this.geona.map._activeLayers)) {
      if (this.geona.map._layerGet(layerIdentifier, 'modifier') === 'basemap') {
        basemapActive = true;
      }
    }

    for (let index = 0; index < this.layersBoxList.length; index++) {
      if (this.layersBoxList[index] === item.dataset.identifier) {
        // If there's a basemap we need to increase the index by 1 (layersBoxList does not track basemaps)
        if (basemapActive === true) {
          this.geona.map.reorderLayers(item.dataset.identifier, index + 1);
        } else {
          this.geona.map.reorderLayers(item.dataset.identifier, index);
        }
      }
    }
  }

  /**
 *
 */
  displayAnalysisPanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__analysis').addClass('geona-menu__tab--active');

    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');

    this.parentDiv.find('.js-geona-panel').prepend(templates.analysis_panel());
  }

  /**
 *
 */
  displayLoginPanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__login').addClass('geona-menu__tab--active');

    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');

    this.parentDiv.find('.js-geona-panel').prepend(templates.login_panel());
  }

  /**
   * Shows the Options panel (select basemaps, borders, graticule, projection)
   */
  displayOptionsPanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__options').addClass('geona-menu__tab--active');

    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');
    this.parentDiv.find('.js-geona-panel').prepend(templates.options_panel());

    // Populate the basemap select
    for (let layerIdentifier of Object.keys(this.geona.map._availableLayers)) {
      let layer = this.geona.map._availableLayers[layerIdentifier];
      if (layer.modifier === 'basemap') {
        this.parentDiv.find('.js-geona-options-panel-content__basemaps').append(
          '<option value="' + layerIdentifier + '">' + layerIdentifier + ' - ' + selectPropertyLanguage(layer.title) + '</option>'
        );
        // Sets the selected dropdown value to match the map's basemap
        if (layerIdentifier === this.geona.map.config.basemap) {
          this.parentDiv.find('.js-geona-options-panel-content__basemaps').val(layerIdentifier).prop('selected', true);
        }
      }
    }

    // Populate the borders select
    for (let layerIdentifier of Object.keys(this.geona.map._availableLayers)) {
      let layer = this.geona.map._availableLayers[layerIdentifier];
      if (layer.modifier === 'borders') {
        for (let style of layer.styles) {
          this.parentDiv.find('.js-geona-options-panel-content__borders').append(
            '<option value="' + layerIdentifier + '" data-style="' + style.identifier + '">' +
            layerIdentifier + ' (' + style.identifier + ') - ' + selectPropertyLanguage(layer.title) +
            '</option>'
          );
          // Sets the selected dropdown value to match the map's borders
          let bordersConfig = this.geona.map.config.borders;
          if (layerIdentifier === bordersConfig.identifier && style.identifier === bordersConfig.style) {
            this.parentDiv.find('.js-geona-options-panel-content__borders').val(layerIdentifier).prop('selected', true);
          }
        }
      }
    }

    // Check graticule box if enabled
    if (this.geona.map.config.graticule === true) {
      this.parentDiv.find('.js-geona-options-panel-content__graticule').prop('checked', true);
    }

    // Select the correct projection dropdown option
    let projection = this.geona.map.config.projection;
    this.selectProjection(projection);
  }

  /**
   * Set the map's basemap to the specified layer.
   * @param {String} basemapIdentifier The identifier for the basemap we want to switch to, or 'None'.
   */
  setBasemap(basemapIdentifier) {
    if (basemapIdentifier === 'None') {
      this.geona.map._clearBasemap();
    } else {
      // Clear the basemap
      this.geona.map._clearBasemap();
      // Add the new basemap
      let geonaLayer = this.geona.map._availableLayers[basemapIdentifier];
      let geonaLayerServer = this.geona.map._availableLayerServers[geonaLayer.layerServer];
      this.geona.map.addLayer(geonaLayer, geonaLayerServer, {modifier: 'basemap'});
      // Select the correct projection dropdown option
      let projection = this.geona.map.config.projection;
      this.selectProjection(projection);
    }
  }

  /**
   * Set the map's borders to the specified layer.
   * @param {String} bordersIdentifier The identifier for the borders we want to switch to, or 'None'.
   * @param {String} [bordersStyle]    The style for the borders we want to add.
   */
  setBorders(bordersIdentifier, bordersStyle) {
    if (bordersIdentifier === 'None') {
      this.geona.map._clearBorders();
    } else {
      this.geona.map._clearBorders();

      let geonaLayer = this.geona.map._availableLayers[bordersIdentifier];
      let geonaLayerServer = this.geona.map._availableLayerServers[geonaLayer.layerServer];
      this.geona.map.addLayer(geonaLayer, geonaLayerServer, {modifier: 'borders', requestedStyle: bordersStyle});
    }
  }

  /**
   * Turn on the graticule.
   */
  showGraticule() {
    this.geona.map.displayGraticule(true);
  }

  /**
   * Turn off the graticule.
   */
  hideGraticule() {
    this.geona.map.displayGraticule(false);
  }

  /**
   * Changes the map projection if possible.
   * @param {String} projection The map projection to use, such as 'EPSG:4326'.
   */
  setProjection(projection) {
    let currentProjection = this.geona.map.setProjection(projection);
    this.parentDiv.find('.js-geona-options-panel-content__projection').val(currentProjection).prop('selected', true);
  }

  /**
   * Sets the selected projection option in the dropdown to the specified projection.
   * @param {String} projection The projection to switch the dropdown to.
   */
  selectProjection(projection) {
    this.parentDiv.find('.js-geona-options-panel-content__projection').val(projection).prop('selected', true);
  }

  /**
 *
 */
  displayHelpPanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__help').addClass('geona-menu__tab--active');

    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');

    this.parentDiv.find('.js-geona-panel').prepend(templates.help_panel());
  }

  /**
 *
 */
  displaySharePanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__share').addClass('geona-menu__tab--active');

    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');

    this.parentDiv.find('.js-geona-panel').prepend(templates.share_panel());
  }
}

/**
   * Takes a Geona layer and constructs an object to use when displaying layer information on the layers list
   * @param {Layer}   geonaLayer The Geona layer definition to get information from.
   * @return {Object}            Object containing information used by the layer item template
   */
function _compileLayerInformation(geonaLayer) {
  let layerInformation = {
    identifier: geonaLayer.identifier,
  };
  if (geonaLayer.title !== undefined) {
    layerInformation.title = selectPropertyLanguage(geonaLayer.title);
  }
  if (geonaLayer.boundingBox !== undefined) {
    layerInformation.boundingBox = {
      north: parseInt(geonaLayer.boundingBox.maxLat).toFixed(2),
      east: parseInt(geonaLayer.boundingBox.maxLon).toFixed(2),
      south: parseInt(geonaLayer.boundingBox.minLat).toFixed(2),
      west: parseInt(geonaLayer.boundingBox.minLon).toFixed(2),
    };
  }
  if (geonaLayer.dimensions !== undefined) {
    if (geonaLayer.dimensions.time) {
      let sortedDates = geonaLayer.dimensions.time.values.sort();
      layerInformation.dateRange = {
        start: moment.utc(sortedDates[0]).format('YYYY-MM-DD'),
        end: moment.utc(sortedDates[sortedDates.length - 1]).format('YYYY-MM-DD'),
      };
    }
  }
  if (geonaLayer.abstract !== undefined) {
    layerInformation.abstract = selectPropertyLanguage(geonaLayer.abstract);
  }
  // TODO contact info is in he layer above - in the server?
  // if (geonaLayer.) {

  // }

  return layerInformation;
}
