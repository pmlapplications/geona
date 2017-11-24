import 'jquery';
import moment from 'moment';
import * as templates from '../../templates/compiled';
import {registerTriggers} from './main_menu_triggers';
import {registerBindings} from './main_menu_bindings';

import {getLayersFromWms, getLayersFromWmts, selectPropertyLanguage} from '../map_common';

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
   * Populates a dropdown list for layers found from a WMS GetCapabilities request.
   */
  getLayersFromWms() {
    this._clearPreviousUrlLayers();
    let url = this.parentDiv.find('.js-geona-explore-panel-content__layer-url').val();
    getLayersFromWms(url)
      .then((layers) => {
        this.parentDiv.find('.js-geona-explore-panel-content__layer-select').removeClass('hidden');
        this.parentDiv.find('.js-geona-explore-panel-content__add-layer').removeClass('hidden');
        let dropdown = this.parentDiv.find('.js-geona-explore-panel-content__layer-select');
        for (let layer of layers.layers) {
          dropdown.append('<option value="' + layer.identifier + '">' + layer.identifier + '</option>');
        }
        this.requestLayers = layers;
      }).catch((err) => {
        console.error(err);
        alert('No layers found.');
      });
  }

  /**
   * Populates a dropdown list for layers found from a WMTS GetCapabilities request.
   */
  getLayersFromWmts() {
    this._clearPreviousUrlLayers();
    let url = this.parentDiv.find('.js-geona-explore-panel-content__layer-url').val();
    getLayersFromWmts(url)
      .then((layers) => {
        this.parentDiv.find('.js-geona-explore-panel-content__layer-select').removeClass('hidden');
        this.parentDiv.find('.js-geona-explore-panel-content__add-layer').removeClass('hidden');
        let dropdown = this.parentDiv.find('.js-geona-explore-panel-content__layer-select');
        for (let layer of layers.layers) {
          dropdown.append('<option value="' + layer.identifier + '">' + layer.identifier + '</option>');
        }
        this.requestLayers = layers;
      }).catch((err) => {
        alert('No layers found. Error: ' + err);
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
      this.requestLayers.length = 0;
    }
  }

  /**
 * Adds the layer in the 'layer-select' input box to the map.
 */
  addUrlLayerToMap() {
    let selectedLayer = this.parentDiv.find('.js-geona-explore-panel-content__layer-select').val();
    for (let layer of this.requestLayers.layers) {
      if (layer.identifier === selectedLayer) {
        if (layer.dimension) {
          if (layer.dimension.time) {
            this.geona.map.addLayer(layer, {modifier: 'hasTime'});
          } else {
            this.geona.map.addLayer(layer);
          }
        } else {
          this.geona.map.addLayer(layer);
        }
      }
    }
  }

  /**
   * Adds the layer in the 'available-layers' input box to the map.
   */
  addAvailableLayerToMap() {
    let layerIdentifier = this.parentDiv.find('.js-geona-explore-panel-content__available-layers').val();
    let layer = this.geona.map._availableLayers[layerIdentifier];
    if (layer.modifier === 'hasTime') {
      this.geona.map.addLayer(layer, {modifier: 'hasTime'});
    } else {
      this.geona.map.addLayer(layer);
    }
  }

  /**
 * Clears current panel content and adds layers currently on map to the list of layers.
 *
 * TODO Think if it would be better to do do each layer individually with add and remove, rather than
 * clear and refresh. Clear and refresh requires a list to track the order of layers. However this list might be
 * required for changing the map anyway.
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
   * @param {String} item The item that was dragged and dropped.
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
