import $ from 'jquery';
import moment from 'moment';
import * as templates from '../../templates/compiled';
import {registerTriggers} from './main_menu_triggers';
import {registerBindings} from './main_menu_bindings';

import {selectPropertyLanguage, getLayerServer, urlInCache} from '../map_common';
import LayerWms from '../../../common/layer/layer_wms';
import LayerWmts from '../../../common/layer/layer_wmts';

import {Scalebar} from './scalebar';

/* Type definitions for this class */
/**
 * A 'this' context, which may be different from this Class instance's 'this' context.
 * @typedef {this} This
 */

// TODO separate mainMenu into individual files for each panel
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

    /** @type {Object} Holds the layerServer found for the most recent WMS/WMTS request. */
    this.requestLayerServer = undefined;
    /** @type {String[]} @desc Holds the order of the layers in the layers list, using identifiers. */
    this.layersPanelItemList = [];
    /** @type {HTMLElement} @desc The currently open layer element - defaults to first layer element. */
    this.layersPanelActiveItemPanel = undefined;

    /** @type {HTMLElement} @desc Holds the explore panel after creation so it can be displayed again easily. */
    this.explorePanel = undefined;
    /** @type {HTMLElement} @desc Holds the layers panel after creation so it can be displayed again easily. */
    this.layersPanel = undefined;
    /** @type {HTMLElement} @desc Holds the analysis panel after creation so it can be displayed again easily. */
    this.analysisPanel = undefined;
    /** @type {HTMLElement} @desc Holds the login panel after creation so it can be displayed again easily. */
    this.loginPanel = undefined;
    /** @type {HTMLElement} @desc Holds the options panel after creation so it can be displayed again easily. */
    this.optionsPanel = undefined;
    /** @type {HTMLElement} @desc Holds the help panel after creation so it can be displayed again easily. */
    this.helpPanel = undefined;
    /** @type {HTMLElement} @desc Holds the share panel after creation so it can be displayed again easily. */
    this.sharePanel = undefined;

    /** @type {Object} @desc Holds an array of impending changes for each layer. */
    this.changesBuffer = {};
    /** @type {Number} @desc CONST - The time to wait (in ms) before executing the buffered operations for a layer. */
    this.CHANGES_BUFFER_TIME = 10000;

    this.layersPanelScalebars = {};


    // Sets up menu toggle control
    if (this.config.collapsible) {
      this.parentDiv.find('.js-geona-menu-bar').append(templates.menu_toggle());
    }

    // Sets up menu
    this.parentDiv.find('.js-geona-menu-bar').append(templates.menu());
    this.parentDiv.find('.js-geona-menu')
      .addClass('removed')
      .append(templates.panel());
    this.parentDiv.find('.js-geona-panel').addClass('removed');
    if (this.config.opened) {
      this.parentDiv.find('.js-geona-menu').removeClass('removed');
      this.parentDiv.find('.js-geona-menu-toggle__icon')
        .removeClass('icon-arrow-65')
        .addClass('icon-arrow-66');
      this.parentDiv.find('.js-geona-menu-toggle__text-open').addClass('removed');
      this.parentDiv.find('.js-geona-menu-toggle__text-close').removeClass('removed');
    }

    // Sets the triggers and bindings for this Menu.
    registerTriggers(this.geona.eventManager, this.parentDiv);
    registerBindings(this.geona.eventManager, this);
  }

  /**
   * Makes menu visible.
   */
  openMenu() {
    this.parentDiv.find('.js-geona-menu').removeClass('removed');
    this.parentDiv.find('.js-geona-menu-toggle__icon')
      .removeClass('icon-arrow-65')
      .addClass('icon-arrow-66');
    this.parentDiv.find('.js-geona-menu-toggle__text-open').addClass('removed');
    this.parentDiv.find('.js-geona-menu-toggle__text-close').removeClass('removed');
  }

  /**
   * Removes menu from the GUI, but not from the DOM.
   */
  closeMenu() {
    this.parentDiv.find('.js-geona-menu').addClass('removed');
    this.parentDiv.find('.js-geona-menu-toggle__icon')
      .removeClass('icon-arrow-66')
      .addClass('icon-arrow-65');
    this.parentDiv.find('.js-geona-menu-toggle__text-close').addClass('removed');
    this.parentDiv.find('.js-geona-menu-toggle__text-open').removeClass('removed');
  }

  /**
   * Removes panel element from the GUI, but not from the DOM.
   */
  closePanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-panel').addClass('removed');
  }

  /**
   * Empties the contents of the Geona menu panel.
   */
  emptyCurrentPanel() {
    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('removed');
  }

  /**
   * ------------------------------------
   * Explore Panel
   * ------------------------------------
   */

  /**
   * Shows the explore panel.
   */
  displayExplorePanel() {
    // Switch the explore tab to be active
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__explore').addClass('geona-menu__tab--active');

    // Remove the current panel contents
    this.emptyCurrentPanel();

    // If the explore panel hasn't been created yet, we need to create it first
    if (this.explorePanel === undefined) {
      this.constructExplorePanel();
      this.explorePanel = this.parentDiv.find('.js-geona-explore-panel-content');
    } else {
      // Add the explore panel
      this.parentDiv.find('.js-geona-panel').prepend(this.explorePanel);
    }
  }

  /**
   * Populates the explore panel with the available layers and layer url loader.
   */
  constructExplorePanel() {
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
    // todo why don't we just use regex.test()?
    // Regex for case-insensitive 'wms' or 'wmts'
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
   * If the file has been cached already, inform the user and offer ability to find layers from cached version.
   * @param {String} url The contents of the URL input box.
   */
  scanCache(url) {
    // Disable button and inform user of cache scan
    this.parentDiv.find('.js-geona-explore-panel-content__add-url').prop('disabled', true);
    this.parentDiv.find('.js-geona-explore-panel-content__cache-checking').removeClass('removed');

    // Timeout in case cache check takes a long time (more than 3s)
    setTimeout(() => {
      // Re-enable button
      this.parentDiv.find('.js-geona-explore-panel-content__add-url').prop('disabled', false);
      this.parentDiv.find('.js-geona-explore-panel-content__cache-checking').addClass('removed');
    }, 3000);

    urlInCache(this.geona.geonaServer, url)
      .then((inCache) => {
        // Re-enable button
        this.parentDiv.find('.js-geona-explore-panel-content__add-url').prop('disabled', false);
        this.parentDiv.find('.js-geona-explore-panel-content__cache-checking').addClass('removed');

        if (inCache === true) {
          // Show the label and checkbox
          this.parentDiv.find('.js-geona-explore-panel-content__cache-notification').removeClass('removed');
          this.parentDiv.find('.js-geona-explore-panel-content__cache-checkbox').removeClass('removed');
          this.changeAddUrlButtonText(false);
        } else {
          this.parentDiv.find('.js-geona-explore-panel-content__cache-notification').addClass('removed');
          this.parentDiv.find('.js-geona-explore-panel-content__cache-checkbox').addClass('removed');
          this.changeAddUrlButtonText(true);
        }
      });
  }

  /**
   * Changes the Add URL button text depending on whether we will use the cache or not
   * @param {Boolean} useUrl True to display the text to use URL
   */
  changeAddUrlButtonText(useUrl) {
    switch (useUrl) {
      case true:
        this.parentDiv.find('.js-geona-explore-panel-content__add-url').html('Find Layers from URL');
        break;
      case false:
        this.parentDiv.find('.js-geona-explore-panel-content__add-url').html('Find Layers from Cache');
    }
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
    getLayerServer(this.geona.geonaServer, url, service, save, useCache)
      .then((layerServerJson) => {
        let layerServerInfo = JSON.parse(layerServerJson);

        this.parentDiv.find('.js-geona-explore-panel-content__layer-select').removeClass('removed');
        this.parentDiv.find('.js-geona-explore-panel-content__add-layer').removeClass('removed');
        let dropdown = this.parentDiv.find('.js-geona-explore-panel-content__layer-select');
        for (let layer of layerServerInfo.layers) {
          dropdown.append('<option value="' + layer.identifier + '">' + layer.identifier + '</option>');
        }
        this.requestLayerServerInfo = layerServerInfo;
      }).catch((err) => {
        console.error(err);
        alert('No layers found. Error: ' + JSON.stringify(err));
      });
  }

  /**
   * Checks whether there are already layers in the dropdown from a getLayersFromWms/Wmts call, and removes them if so.
   */
  _clearPreviousUrlLayers() {
    let previousUrlLayersFound = this.parentDiv.find('.js-geona-explore-panel-content__layer-select').contents().length > 0;
    if (previousUrlLayersFound === true) {
      this.parentDiv.find('.js-geona-explore-panel-content__layer-select').empty().addClass('removed');
      this.parentDiv.find('.js-geona-explore-panel-content__add-layer').addClass('removed');
      // Clears the array and removes all references to its previous values
      this.requestLayerServer = undefined;
    }
  }

  /**
   * Adds the layer in the 'layer-select' input box to the map.
   * @param {String} layerIdentifier The identifier for the layer in the input box
   */
  addUrlLayerToMap(layerIdentifier) {
    let layerServerInfoDeepCopy = JSON.parse(JSON.stringify(this.requestLayerServerInfo));
    for (let layer of layerServerInfoDeepCopy.layers) {
      if (layer.identifier === layerIdentifier) {
        let geonaLayer;
        switch (layer.protocol.toLowerCase()) {
          case 'wms':
            geonaLayer = new LayerWms(this.geona.geonaServer, layer, layerServerInfoDeepCopy.layerServer);
            break;
          case 'wmts':
            geonaLayer = new LayerWmts(layer, layerServerInfoDeepCopy.layerServer);
            break;
          default:
            throw new Error('Unsupported layer protocol: ' + layer.protocol.toLowerCase());
        }
        if (layer.dimension && layer.dimension.time) {
          this.geona.map.addLayer(geonaLayer, layerServerInfoDeepCopy.layerServer, {modifier: 'hasTime'});
        } else {
          this.geona.map.addLayer(geonaLayer, layerServerInfoDeepCopy.layerServer);
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
      this.geona.map.addLayer(layer, layerServer, {modifier: 'hasTime'}); // FIXME adds duplicates now instead of erroring
    } else {
      this.geona.map.addLayer(layer, layerServer);
    }
  }

  /**
   * ------------------------------------
   * Layers Panel
   * ------------------------------------
   */

  /**
   * Clears current panel content and adds layers currently on map to the list of layers.
   */
  displayLayersPanel() {
    // Switch the layers tab to be active
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__layers').addClass('geona-menu__tab--active');

    // Remove the current panel contents
    this.emptyCurrentPanel();

    // If the layers panel hasn't been created yet, we need to create it first
    if (this.layersPanel === undefined) {
      this.constructLayersPanel();
      this.layersPanel = this.parentDiv.find('.js-geona-layers-list');
    } else {
      // Add the layers panel
      this.parentDiv.find('.js-geona-panel').prepend(this.layersPanel);
    }
  }

  /**
   * Populates the layers panel with the active layer information.
   */
  constructLayersPanel() {
    this.parentDiv.find('.js-geona-panel').append(templates.layers_panel());

    let activeLayersKeys = Object.keys(this.geona.map._activeLayers);
    // Double loop used to find the zIndex of a layer so the list can be populated correctly
    for (let index = 0; index < activeLayersKeys.length; index++) {
      // Loop through the active layers on the map and populate the layers list
      for (let activeLayerKey of activeLayersKeys) {
        let modifier = this.geona.map.layerGet(activeLayerKey, 'modifier');
        let zIndex = this.geona.map.layerGet(activeLayerKey, 'zIndex');
        if (modifier !== 'basemap' && modifier !== 'borders' && zIndex === index) {
          this.addLayerItem(activeLayerKey);
        }
      }
    }

    this.layersPanelItemList.length = 0;
    for (let layerBox of this.parentDiv.find('.js-geona-layers-list').children()) {
      this.layersPanelItemList.unshift(layerBox.dataset.identifier);
    }

    // Find the topmost HTML element in the list to use for the default active layer
    let topmostItem = this.parentDiv.find('.js-geona-layers-list').children()[0];
    this.layersPanelActiveItemPanel = $(topmostItem).find('.js-geona-layers-list__item-body-info')[0];

    // Make its contents visible
    this.layersPanelActiveItemPanel.classList.remove('removed');
  }

  /**
   * Adds a layer item to the layers panel list.
   * @param {String} layerIdentifier The identifier for the data layer we want to create an item for.
   */
  addLayerItem(layerIdentifier) {
    let modifier = this.geona.map.layerGet(layerIdentifier, 'modifier');
    if (modifier === 'basemap' || modifier === 'borders') {
      throw new Error('Cannot add a map layer item to the GUI for a basemap or borders layer! Use a layer with no modifier or a \'hasTime\' modifier instead.');
    } else {
      // Get the data in the correct format from the geona layer
      let data = this._compileLayerData(this.geona.map._availableLayers[layerIdentifier]);
      // Insert layer data object at the top of the list - higher on the list means higher on the map
      this.parentDiv.find('.js-geona-layers-list').prepend(templates.layers_panel_item({data: data}));
      let item = this.parentDiv.find('.js-geona-layers-list__item[data-identifier="' + data.info.identifier + '"]');

      this.layersPanelScalebars[data.info.identifier] = new Scalebar(this, {
        layersPanelItem: item,
        layerIdentifier: data.info.identifier,
      });

      // Hide all panels
      $(item).find('.js-geona-layers-list__item-body-settings').addClass('removed');
      $(item).find('.js-geona-layers-list__item-body-info').addClass('removed');
      $(item).find('.js-geona-layers-list__item-body-analysis').addClass('removed');

      // Make current style selected in settings
      let currentStyle = this.geona.map.layerSourceGet(data.info.identifier, 'style');
      $(item).find('.js-geona-layers-list__item-body-settings-styles-select').val(currentStyle).prop('selected', true);
    }
  }

  /**
   * Takes a Geona layer and constructs an object to use when displaying layer information on the layers list
   * @param {Layer}   geonaLayer The Geona layer definition to get information from.
   * @return {Object}            Object containing information used by the layer item template
   */
  _compileLayerData(geonaLayer) {
    // Compile data for the settings panel
    let layerSettings = {};

    if (geonaLayer.styles) {
      layerSettings.styles = [];
      for (let style of geonaLayer.styles) {
        layerSettings.styles.push(style.identifier);
      }
    }

    // Opacity
    layerSettings.opacityReal = this.geona.map.layerGet(geonaLayer.identifier, 'opacity');
    layerSettings.opacityPercent = Math.round(layerSettings.opacityReal * 100);


    // Compile data for the info panel
    let layerInfo = {
      identifier: geonaLayer.identifier,
    };
    // Gets the title or the display name in appropriate language
    if (geonaLayer.title !== undefined) {
      layerInfo.title = selectPropertyLanguage(geonaLayer.getTitleOrDisplayName());
    }
    // The bounding box
    if (geonaLayer.boundingBox !== undefined) {
      layerInfo.boundingBox = {
        north: parseInt(geonaLayer.boundingBox.maxLat, 10).toFixed(2),
        east: parseInt(geonaLayer.boundingBox.maxLon, 10).toFixed(2),
        south: parseInt(geonaLayer.boundingBox.minLat, 10).toFixed(2),
        west: parseInt(geonaLayer.boundingBox.minLon, 10).toFixed(2),
      };
    }
    // Time min and max, formatted as YYYY-MM-DD
    if (geonaLayer.dimensions !== undefined) {
      if (geonaLayer.dimensions.time) {
        let sortedDates = this.geona.map.getActiveLayerDatetimes(geonaLayer.identifier);
        if (sortedDates.length === 1) {
          layerInfo.dateRange = moment.utc(sortedDates[0]).format('YYYY-MM-DD') + ' only.';
        } else {
          layerInfo.dateRange = moment.utc(sortedDates[0]).format('YYYY-MM-DD') + ' to ' +
          moment.utc(sortedDates[sortedDates.length - 1]).format('YYYY-MM-DD');
        }
      }
    }
    // Abstract in appropriate language
    if (geonaLayer.abstract !== undefined) {
      layerInfo.abstract = selectPropertyLanguage(geonaLayer.abstract);
    }
    // Contact Information
    let layerServer = this.geona.map._availableLayerServers[geonaLayer.layerServer];
    if (layerServer.service && layerServer.service.contactInformation) {
      layerInfo.contactInformation = layerServer.service.contactInformation;
    }

    // Return all
    return {
      settings: layerSettings,
      info: layerInfo,
    };
  }

  /**
   * Reorders the map layers. Also recreates the layersPanelItemList array to match the current ul list of elements
   * @param {HTMLElement} item The item that was dragged and dropped.
   */
  reorderLayers(item) {
    // Reset the list
    this.layersPanelItemList.length = 0;
    // Repopulate the list
    for (let layerBox of this.parentDiv.find('.js-geona-layers-list').children()) {
      this.layersPanelItemList.unshift(layerBox.dataset.identifier);
    }

    let basemapActive = false;
    for (let layerIdentifier of Object.keys(this.geona.map._activeLayers)) {
      if (this.geona.map.layerGet(layerIdentifier, 'modifier') === 'basemap') {
        basemapActive = true;
      }
    }

    for (let index = 0; index < this.layersPanelItemList.length; index++) {
      if (this.layersPanelItemList[index] === item.dataset.identifier) {
        // If there's a basemap we need to increase the index by 1 (layersPanelItemList does not track basemaps)
        if (basemapActive === true) {
          this.geona.map.reorderLayers(item.dataset.identifier, index + 1);
        } else {
          this.geona.map.reorderLayers(item.dataset.identifier, index);
        }
      }
    }
  }

  /**
   * Opens the specified panel of the specified item.
   * @param {HTMLElement} item  The item in the layers list.
   * @param {String}      panel The name of the panel to open ('settings', 'info', 'analysis').
   */
  toggleLayersPanelItemPanel(item, panel) {
    let itemPanelToToggle = $(item).find('.js-geona-layers-list__item-body-' + panel)[0];

    // If the item we want to toggle is the currently active panel, just close it
    if (itemPanelToToggle.isEqualNode(this.layersPanelActiveItemPanel)) {
      itemPanelToToggle.classList.add('removed');
      this.layersPanelActiveItemPanel = undefined;
    } else {
      if (this.layersPanelActiveItemPanel !== undefined) {
        this.layersPanelActiveItemPanel.classList.add('removed'); // Close the current panel
      }
      itemPanelToToggle.classList.remove('removed'); // Open the new panel
      this.layersPanelActiveItemPanel = itemPanelToToggle;
    }
  }

  /**
   * Removes the layer specified in the item from the map
   * @param {HTMLElement} item The list element that contains the element that was clicked.
   */
  removeLayer(item) {
    this.geona.map.removeLayer(item.dataset.identifier);
    // Returns true if browser is Internet Explorer 11
    let isIe11 = Boolean(window.MSInputMethodContext) && Boolean(document.documentMode);
    if (isIe11 === true) {
      item.removeNode(true);
    } else {
      item.remove();
    }
  }

  /**
   * Hides the layer specified in the item
   * @param {String}      identifier The identifier for the layer to hide.
   * @param {HTMLElement} item       The element that was clicked.
   */
  hideLayer(identifier, item) {
    // Remove the button which represents a layer being currently shown
    item.classList.add('removed');
    // Find the button which represents a layer being currently hidden
    let visibilityHidingElement = item.nextElementSibling;
    // Make the hidden button visible (un-remove it)
    visibilityHidingElement.classList.remove('removed');

    this.geona.map.hideLayer(identifier);
  }

  /**
   * Shows the layer specified in the item
   * @param {String}      identifier The identifier for the layer to show.
   * @param {HTMLElement} item       The element that was clicked.
   */
  showLayer(identifier, item) {
    // Remove the button which represents a layer being currently hidden
    item.classList.add('removed');
    // Find the button which represents a layer being currently shown
    let visibilityShowingElement = item.previousElementSibling;
    // Make the showing button visible (un-remove it)
    visibilityShowingElement.classList.remove('removed');

    this.geona.map.showLayer(identifier);
  }

  /**
   * Updates the values in the scale min and max boxes.
   * @param {HTMLElement} item The panel item which contains the boxes to change.
   * @param {Number}      min  The minimum value for the scalebar.
   * @param {Number}      max  The maximum value for the scalebar.
   */
  setScalebarInputs(item, min, max) {
    $(item).find('.js-geona-layers-list__item-body-settings__scale-min').val(min);
    $(item).find('.js-geona-layers-list__item-body-settings__scale-max').val(max);
    // TODO Collaboration - add eventManager call for collaboration (will use class variable to remove eslint complaint)
  }

  /**
   * Finds the min and max values and updates the scalebar and settings.
   * @param {HTMLElement} item The item for the layer being changed.
   */
  applyAutoScale(item) {
    let layerIdentifier = item.dataset.identifier;
    let geonaLayer = this.geona.map._availableLayers[layerIdentifier];
    this.layersPanelScalebars[layerIdentifier].getAutoScale()
      .then((minMaxObject) => {
        let min = minMaxObject.min;
        let max = minMaxObject.max;
        let log = geonaLayer.scale.logarithmicDefault;
        this.layersPanelScalebars[layerIdentifier].validateScale(min, max, log);
        this.addToChangesBuffer(layerIdentifier, this.setScalebarInputs, this, [item, min, max]); // fixme will glitch if the min and max value boxes are then changed?
      })
      .catch((err) => {
        console.error('Unable to automatically find min and max values for layer ' + layerIdentifier + '. Returned error: ' + err);
        alert('Unable to automatically find min and max values for layer ' + layerIdentifier + '. Returned error: ' + err);
      });
  }

  /**
   * Changes the layer opacity for the layer which corresponds to the given item.
   * @param {HTMLElement} item    The layers panel item which was clicked.
   * @param {Number}      opacity The value for the opacity between 0 and 1.
   */
  changeLayerOpacity(item, opacity) {
    $(item).find('.js-geona-layers-list__item-body-settings-opacity-heading')
      .text('Layer Opacity - ' + Math.round(opacity * 100) + '%'); // Math.round to avoid displaying decimals
    let layerIdentifier = item.dataset.identifier;
    this.geona.map.setLayerOpacity(layerIdentifier, opacity);
  }

  // TODO do we need this? Or should we just call the map method?
  /**
   * Changes the layer style.
   * @param {HTMLElement} item  The list item which contains the select which was clicked.
   * @param {String}      style The identifier for the style to select.
   */
  changeLayerStyle(item, style) {
    let identifier = item.dataset.identifier;
    this.geona.map.changeLayerStyle(identifier, style);
  }

  /**
   * Adds a function, with parameters, to this layer's changes buffer. Overwrites already-existing buffered references
   * to this function for this layer.
   * @param {String}   layerIdentifier The identifier for the layer we are making changes to.
   * @param {Function} func            The function to call once the buffer has timed out.
   * @param {This}     context         The 'this' context to use with the function.
   * @param {*[]}      [params]        The parameters to call with the function.
   */
  addToChangesBuffer(layerIdentifier, func, context, params) {
    // If this is the first time an operation is being buffered for this layer, we'll initialise its buffer
    if (this.changesBuffer[layerIdentifier] === undefined) {
      this.changesBuffer[layerIdentifier] = {
        operations: new Set(),
        timeout: undefined,
      };
    }
    let layerBuffer = this.changesBuffer[layerIdentifier];

    // We need to check if the function we've been given is already buffered - if it is, we will remove the older one
    for (let operation of layerBuffer.operations) {
      if (operation.func === func) {
        layerBuffer.operations.delete(operation);
      }
    }

    // Append the new function and params to the list of operations
    layerBuffer.operations.add({
      func: func,
      context: context,
      params: params,
    });

    // Set a new timeout
    clearTimeout(layerBuffer.timeout);
    layerBuffer.timeout = setTimeout(() => {
      // When the timeout is finished, we will execute the operations
      this.executeChangesBuffer(layerIdentifier);
    }, this.CHANGES_BUFFER_TIME);

    // Set a new 'Apply Changes' button animation
    this.animateChangesBufferButton(layerIdentifier);
  }

  /**
   * Executes all the buffered operations in the order they were added.
   * @param {String} layerIdentifier The layer whose operations we are going to execute.
   */
  executeChangesBuffer(layerIdentifier) { // fixme if a valid operation is added, then an invalid operation is error thrown in validatescale(), this will still execute, but the GUI will be out of sync
    let layerBuffer = this.changesBuffer[layerIdentifier];

    // The buffer may not have been made for this layer yet
    if (layerBuffer) {
      // The timeout might still be active, so we will clear it
      clearTimeout(layerBuffer.timeout);

      // We will loop through and execute all the operations
      for (let operation of layerBuffer.operations) {
        operation.func.apply(operation.context, operation.params);
      }

      // Reset the operations for this layer
      layerBuffer.operations.clear();

      // Remove the button from view
      this.removeChangesBufferButton(layerIdentifier);
    } else {
      throw new Error('Changes buffer has not been initialised for layer ' + layerIdentifier +
      '. Add a function to the buffer first.');
    }
  }

  /**
   * Starts the animation for the changes buffer 'Apply Changes' button from the beginning.
   * @param {String} layerIdentifier The identifier for the layer whose button we want to animate.
   */
  animateChangesBufferButton(layerIdentifier) {
    // The 'apply changes' button
    let button = this.parentDiv
      .find('.js-geona-layers-list__item[data-identifier="' + layerIdentifier + '"]') // Find the item
      .find('.js-geona-layers-list__item-body-settings__apply-changes')[0]; // Find the button for this item
    // The animating background element which indicates the time
    let buttonTimeIndicator = $(button)
      .find('.js-geona-layers-list__item-body-settings__apply-changes__time-indicator')[0];

    // Make the button visible if it isn't already
    button.classList.remove('removed');
    // Set the animation duration to match the changes buffer time if it isn't already
    buttonTimeIndicator.style.animationDuration = this.CHANGES_BUFFER_TIME + 'ms';

    // The button might already be mid-animation, so we need to forcibly restart it
    button.classList.remove('animating');
    buttonTimeIndicator.classList.remove('animating');
    // This forces the animation to restart by triggering a DOM reflow
    forceCssReflow(buttonTimeIndicator);

    // We add the class animating to trigger the animation of the time indicator and make the button translucent
    button.classList.add('animating');
    buttonTimeIndicator.classList.add('animating');
  }

  /**
   * Removes the buffer 'apply changes' button from view.
   * @param {String} layerIdentifier The identifier for the layer whose button we want to remove.
   */
  removeChangesBufferButton(layerIdentifier) {
    // The 'apply changes' button
    let button = this.parentDiv
      .find('.js-geona-layers-list__item[data-identifier="' + layerIdentifier + '"]') // Find the item
      .find('.js-geona-layers-list__item-body-settings__apply-changes')[0]; // Find the button for this item
    // The animating background element which indicates the time
    let buttonTimeIndicator = $(button)
      .find('.js-geona-layers-list__item-body-settings__apply-changes__time-indicator')[0];

    // Hide the button from view
    button.classList.add('removed');

    // Resets the button to its non-animating state, so that it can be re-animated later
    button.classList.remove('animating');
    buttonTimeIndicator.classList.remove('animating');
  }

  /**
   * Sets the color which should be returned from the server for data values below the current scale minimum.
   * @param {String} layerIdentifier The identifier for the layer we are altering.
   * @param {String} optionValue     The value returned from the dropdown option.
   */
  setBelowMinColor(layerIdentifier, optionValue) {
    let geonaLayer = this.geona.map._availableLayers[layerIdentifier];

    // Regex for matching '0x' followed by a valid hex code
    if (/0x(?:[0-9a-fA-F]{3}){1,2}/.test(optionValue) || optionValue === 'transparent') {
      geonaLayer.scale.belowMinColor = optionValue;
    } else if (/(?:[0-9a-fA-F]{3}){1,2}/.test(optionValue)) { // Regex for matching a valid hex code
      geonaLayer.scale.belowMinColor = '0x' + optionValue;
    } else if (optionValue === 'Default') {
      geonaLayer.scale.belowMinColor = undefined;
    } else {
      throw new Error('belowMinColor value of ' + optionValue + ' is not valid! Values must be one of \'0x[valid hex code]\', \'[valid hex code]\', \'transparent\' or \'Default\'.');
    }

    let scalebar = this.layersPanelScalebars[layerIdentifier];
    this.addToChangesBuffer(layerIdentifier, scalebar.updateScalebar, scalebar);
  }

  /**
   * Sets the color which should be returned from the server for data values above the current scale maximum.
   * @param {String} layerIdentifier The identifier for the layer we are altering.
   * @param {String} optionValue     The value returned from the dropdown option.
   */
  setAboveMaxColor(layerIdentifier, optionValue) {
    let geonaLayer = this.geona.map._availableLayers[layerIdentifier];

    // Regex for matching '0x' followed by a valid hex code
    if (/0x(?:[0-9a-fA-F]{3}){1,2}/.test(optionValue) || optionValue === 'transparent') {
      geonaLayer.scale.aboveMaxColor = optionValue;
    } else if (/(?:[0-9a-fA-F]{3}){1,2}/.test(optionValue)) { // Regex for matching a valid hex code
      geonaLayer.scale.aboveMaxColor = '0x' + optionValue;
    } else if (optionValue === 'Default') {
      geonaLayer.scale.aboveMaxColor = undefined;
    } else {
      throw new Error('aboveMaxColor value of ' + optionValue + ' is not valid! Values must be one of \'0x[valid hex code]\', \'[valid hex code]\', \'transparent\' or \'Default\'.');
    }

    let scalebar = this.layersPanelScalebars[layerIdentifier];
    this.addToChangesBuffer(layerIdentifier, scalebar.updateScalebar, scalebar);
  }

  /**
   * Shows the input area for below min custom color.
   * @param {HTMLElement} item The item that contains the input area.
   */
  showBelowMinColorInput(item) {
    $(item).find('.js-geona-layers-list__item-body-settings__below-min-color-input')
      .removeClass('removed');
    // TODO Collaboration - add eventManager call for collaboration (will use class variable to remove eslint complaint)
  }

  /**
   * Hides the input area for below min custom color.
   * @param {HTMLElement} item The item that contains the input area.
   */
  hideBelowMinColorInput(item) {
    $(item).find('.js-geona-layers-list__item-body-settings__below-min-color-input')
      .addClass('removed');
    // TODO Collaboration - add eventManager call for collaboration (will use class variable to remove eslint complaint)
  }

  /**
   * Shows the input area for above max custom color.
   * @param {HTMLElement} item The item that contains the input area.
   */
  showAboveMaxColorInput(item) {
    $(item).find('.js-geona-layers-list__item-body-settings__above-max-color-input')
      .removeClass('removed');
    // TODO Collaboration - add eventManager call for collaboration (will use class variable to remove eslint complaint)
  }

  /**
   * Hides the input area for above max custom color.
   * @param {HTMLElement} item The item that contains the input area.
   */
  hideAboveMaxColorInput(item) {
    $(item).find('.js-geona-layers-list__item-body-settings__above-max-color-input')
      .addClass('removed');
    // TODO Collaboration - add eventManager call for collaboration (will use class variable to remove eslint complaint)
  }

  /**
   * Updates the number of color bands used in the data scale.
   * @param {HTMLElement} item             The item for the layer we are updating.
   * @param {Number}      numberColorBands The number of color bands between 1 and 255.
   */
  setNumberOfColorBands(item, numberColorBands) {
    let numColorBands = numberColorBands;
    // Enforce number extent
    if (numColorBands < 1) {
      numColorBands = 1;
    } else if (numColorBands > 255) {
      numColorBands = 255;
    }

    // Set the new option for the Geona Layer
    let layerIdentifier = item.dataset.identifier;
    let geonaLayer = this.geona.map._availableLayers[layerIdentifier];
    geonaLayer.scale.numColorBands = numColorBands;

    // Add the function to update scalebar to the buffer
    let scalebar = this.layersPanelScalebars[layerIdentifier];
    this.addToChangesBuffer(layerIdentifier, scalebar.updateScalebar, scalebar);

    // Update the color band box and slider
    $(item).find('.js-geona-layers-list__item-body-settings__color-bands-text').val(numColorBands);
    $(item).find('.js-geona-layers-list__item-body-settings__color-bands-slider').val(numColorBands);
  }

  /**
   * ------------------------------------
   * Analysis Panel
   * ------------------------------------
   */

  /**
   *
   */
  displayAnalysisPanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__analysis').addClass('geona-menu__tab--active');

    this.emptyCurrentPanel();

    // If the analysis panel hasn't been created yet, we need to create it first
    if (this.analysisPanel === undefined) {
      this.constructAnalysisPanel();
      this.analysisPanel = this.parentDiv.find('.js-geona-analysis-panel-content');
    } else {
      // Add the analysis panel
      this.parentDiv.find('.js-geona-panel').prepend(this.analysisPanel);
    }
  }

  constructAnalysisPanel() {
    this.parentDiv.find('.js-geona-panel').prepend(templates.analysis_panel());
  }

  /**
   * ------------------------------------
   * Login Panel
   * ------------------------------------
   */

  /**
   *
   */
  displayLoginPanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__login').addClass('geona-menu__tab--active');

    this.emptyCurrentPanel();

    // If the login panel hasn't been created yet, we need to create it first
    if (this.loginPanel === undefined) {
      this.constructLoginPanel();
      this.loginPanel = this.parentDiv.find('.js-geona-login-panel-content');
    } else {
      // Add the login panel
      this.parentDiv.find('.js-geona-panel').prepend(this.loginPanel);
    }
  }

  constructLoginPanel() {
    this.parentDiv.find('.js-geona-panel').prepend(templates.login_panel());
  }

  /**
   * ------------------------------------
   * Options Panel
   * ------------------------------------
   */

  /**
   * Shows the Options panel (select basemaps, borders, graticule, projection)
   */
  displayOptionsPanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__options').addClass('geona-menu__tab--active');

    this.emptyCurrentPanel();

    // If the options panel hasn't been created yet, we need to create it first
    if (this.optionsPanel === undefined) {
      this.constructOptionsPanel();
      this.optionsPanel = this.parentDiv.find('.js-geona-options-panel-content');
    } else {
      // Add the options panel
      this.parentDiv.find('.js-geona-panel').prepend(this.optionsPanel);
    }
  }

  /**
   * 
   */
  constructOptionsPanel() {
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
        for (let style of layer.styles) { // Each border option will be based on the style as well
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
   * @param {String} previousProjection The previously selected projection.
   * @param {String} newProjection The map projection to use, such as 'EPSG:4326'.
   */
  setProjection(previousProjection, newProjection) {
    try {
      this.geona.map.setProjection(newProjection);
    } catch (err) {
      this.parentDiv.find('.js-geona-options-panel-content__projection').val(previousProjection).prop('selected', true);
    }
  }

  /**
   * Sets the selected projection option in the dropdown to the specified projection.
   * @param {String} projection The projection to switch the dropdown to.
   */
  selectProjection(projection) {
    this.parentDiv.find('.js-geona-options-panel-content__projection').val(projection).prop('selected', true);
  }

  /**
   * ------------------------------------
   * Help Panel
   * ------------------------------------
   */

  /**
   *
   */
  displayHelpPanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__help').addClass('geona-menu__tab--active');

    this.emptyCurrentPanel();

    // If the help panel hasn't been created yet, we need to create it first
    if (this.helpPanel === undefined) {
      this.constructHelpPanel();
      this.helpPanel = this.parentDiv.find('.js-geona-help-panel-content');
    } else {
      // Add the help panel
      this.parentDiv.find('.js-geona-panel').prepend(this.helpPanel);
    }
  }

  /**
   * Populates the help panel.
   */
  constructHelpPanel() {
    this.parentDiv.find('.js-geona-panel').prepend(templates.help_panel());
  }

  /**
   * ------------------------------------
   * Share Panel
   * ------------------------------------
   */

  /**
   *
   */
  displaySharePanel() {
    this.parentDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.parentDiv.find('.js-geona-menu__share').addClass('geona-menu__tab--active');

    this.emptyCurrentPanel();

    // If the share panel hasn't been created yet, we need to create it first
    if (this.sharePanel === undefined) {
      this.constructSharePanel();
      this.sharePanel = this.parentDiv.find('.js-geona-share-panel-content');
    } else {
      // Add the share panel
      this.parentDiv.find('.js-geona-panel').prepend(this.sharePanel);
    }
  }

  /**
   * Populates the share panel.
   */
  constructSharePanel() {
    this.parentDiv.find('.js-geona-panel').prepend(templates.share_panel());
  }
}

/**
 * Forces the CSS to reflow for the given element. Used to restart an animation (like on the 'Apply Changes' button).
 *
 * It is important to note that DOM reflow can be very expensive, so where possible try to remove your animated
 * components from the DOM flow by styling the element CSS to position: absolute or position: fixed.
 *
 * @param {HTMLElement} element The element to reflow around.
 */
function forceCssReflow(element) {
  // A bit of a hack - there is no proper method to restart an animation before it's complete.
  void element.offsetWidth; // eslint-disable-line no-void
}
