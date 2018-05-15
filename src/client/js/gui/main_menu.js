/** @module main_menu */

import $ from 'jquery';
import moment from 'moment';
import * as templates from '../../templates/compiled';
import {registerTriggers, registerLayersTriggers, registerExploreTriggers, registerOptionsTriggers} from './main_menu_triggers';
import {registerBindings} from './main_menu_bindings';

import {selectPropertyLanguage, getLayerServer, urlInCache} from '../map_common';
import LayerWms from '../../../common/layer/layer_wms';
import LayerWmts from '../../../common/layer/layer_wmts';

import {Scalebar} from './scalebar';

// TODO separate mainMenu into individual files for each panel
// TODO layer panel items should be classes of their own - this means that triggers will not have to find the item by closest li element, and can just find the instance in a list
// TODO consider refactoring validateScale() because it calls updateScale() by itself and I don't really like that
// TODO WMTS layers are not properly supported currently (scalebar, timeline)
/**
 * Loads the templates and defines the functions relating to the main menu.
 */
export class MainMenu {
  /**
   * Creates an instance of a MainMenu element to put on the GUI.
   * @param {Gui}               gui                 The parent Gui of this MainMenu.
   * @param {MenuConfigOptions} [menuConfigOptions] The config settings relating to the main menu.
   */
  constructor(gui, menuConfigOptions) {
    /** @type {Geona} @desc This instance of Geona. Used to gain access to the map from the GUI. */
    this.gui = gui;
    /** @type {Geona} @desc This instance of Geona. Used to gain access to the map from the GUI. */
    this.geona = gui.geona;
    /** @type {MenuConfigOptions} @desc The options to configure the main menu. */
    this.config = menuConfigOptions;
    this.geonaDiv = gui.geonaDiv;
    this.eventManager = this.geona.eventManager;

    /** @type {Object} Holds the layerServer found for the most recent WMS/WMTS request. */
    this.requestLayerServer = undefined;
    /** @type {String[]} @desc Holds the order of the layers in the layers list, using identifiers. */
    this.layersPanelItemList = [];
    /** @type {HTMLElement} @desc The currently open layer item tab - defaults to first layer item's info tab. */
    this.layersPanelActiveItemTab = undefined;

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


    // We only draw the menu if it will ever be visible
    if (this.config.allowToggle || this.config.opened) {
      // Sets up menu toggle control
      if (this.config.allowToggle) {
        this.geonaDiv.find('.js-geona-menu-bar').append(templates.menu_toggle());
      }

      // Sets up menu
      this.geonaDiv.find('.js-geona-menu-bar').append(templates.menu());
      this.geonaDiv.find('.js-geona-menu')
        .addClass('removed')
        .append(templates.panel());

      // Hide menu by default
      this.geonaDiv.find('.js-geona-panel').addClass('removed');
      if (this.config.opened) {
        // Show the menu
        this.openMenu();
      }

      // Show specific panel if possible
      switch (this.config.activePanel.panel) {
        case 'explore':
          this.displayExplorePanel();
          break;
        case 'layers':
          this.displayLayersPanel();
          break;
        case 'analysis':
          this.displayAnalysisPanel();
          break;
        case 'login':
          this.displayLoginPanel();
          break;
        case 'options':
          this.displayOptionsPanel();
          break;
        case 'help':
          this.displayHelpPanel();
          break;
        case 'share':
          this.displaySharePanel();
          break;
      }

      // Sets the triggers and bindings for this Menu.
      registerTriggers(this.eventManager, this.geonaDiv);
      registerBindings(this.eventManager, this);
    }
  }

  /**
   * Makes menu visible.
   */
  openMenu() {
    this.geonaDiv.find('.js-geona-menu').removeClass('removed');
    this.geonaDiv.find('.js-geona-menu-toggle__icon')
      .removeClass('icon-arrow-65')
      .addClass('icon-arrow-66');
    this.geonaDiv.find('.js-geona-menu-toggle__text-open').addClass('removed');
    this.geonaDiv.find('.js-geona-menu-toggle__text-close').removeClass('removed');

    this.config.opened = true;
  }

  /**
   * Removes menu from the GUI, but not from the DOM.
   */
  closeMenu() {
    this.geonaDiv.find('.js-geona-menu').addClass('removed');
    this.geonaDiv.find('.js-geona-menu-toggle__icon')
      .removeClass('icon-arrow-66')
      .addClass('icon-arrow-65');
    this.geonaDiv.find('.js-geona-menu-toggle__text-close').addClass('removed');
    this.geonaDiv.find('.js-geona-menu-toggle__text-open').removeClass('removed');

    this.config.opened = false;
  }

  /**
   * Removes panel container element from the GUI, but not from the DOM.
   */
  closePanel() {
    this.geonaDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.geonaDiv.find('.js-geona-panel').addClass('removed');
  }

  /**
   * Empties the contents of the Geona menu panel.
   */
  emptyCurrentPanel() {
    // Remove all panel content from view
    this.geonaDiv.find('.js-geona-panel').children().addClass('removed');
    // Make the panel itself visible
    this.geonaDiv.find('.js-geona-panel')
      .removeClass('removed');

    if (!this.geona.loadingInitialMenu) {
      this.config.activePanel = {
        panel: 'none',
        item: '',
        tab: 'none',
      };
    }
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
    this.geonaDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.geonaDiv.find('.js-geona-menu__explore').addClass('geona-menu__tab--active');

    // Remove the current panel contents
    this.emptyCurrentPanel();

    // If the explore panel hasn't been created yet, we need to create it first
    if (this.explorePanel === undefined) {
      this.constructExplorePanel();
      this.explorePanel = this.geonaDiv.find('.js-geona-explore-panel-content')[0];
    } else {
      // Add the explore panel
      this.explorePanel.classList.remove('removed');
    }

    // At this stage of the method we have loaded the correct panels and can use normal behaviour
    this.geona.loadingInitialMenu = false;

    // Update the config
    this.config.activePanel = {
      panel: 'explore',
      item: '',
      tab: 'none',
    };
  }

  /**
   * Populates the explore panel with the available layers and layer url loader.
   */
  constructExplorePanel() {
    this.geonaDiv.find('.js-geona-panel').prepend(templates.explore_panel());

    // Leaflet doesn't support WMTS, so we will remove it from the Leaflet options
    if (this.geona.map.config.library.toLocaleLowerCase() === 'leaflet') {
      this.geonaDiv.find('.js-geona-explore-panel-content__service option[value="WMTS"]').remove();
    }

    // Populate available layers dropdown
    for (let layerIdentifier of Object.keys(this.geona.map.availableLayers)) {
      let layer = this.geona.map.availableLayers[layerIdentifier];
      if (layer.modifier !== 'basemap' && layer.modifier !== 'borders') {
        this.geonaDiv.find('.js-geona-explore-panel-content__available-layers').append(
          '<option value="' + layerIdentifier + '">' + layerIdentifier + ' - ' + selectPropertyLanguage(layer.title) + '</option>'
        );
      }
    }

    // Set triggers
    registerExploreTriggers(this.eventManager, this.geonaDiv);
  }

  /**
   * Automatically changes the service dropdown option based on the content of the URL
   * @param {String} url The URL currently in the input box
   */
  autoselectService(url) {
    // Regex for case-insensitive 'wms' or 'wmts'
    let result = /((w|W)(m|M)(s|S))|((w|W)(m|M)(t|T)(s|S))/.exec(url);
    if (result !== null) {
      switch (result[0].toLocaleLowerCase()) {
        case 'wms':
          this.geonaDiv.find('.js-geona-explore-panel-content__service').val('WMS').prop('selected', true);
          break;
        case 'wmts':
          if (this.geonaDiv.find('.js-geona-explore-panel-content__service option[value="WMTS"]').length === 1) {
            this.geonaDiv.find('.js-geona-explore-panel-content__service').val('WMTS').prop('selected', true);
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
    this.geonaDiv.find('.js-geona-explore-panel-content__add-url').prop('disabled', true);
    this.geonaDiv.find('.js-geona-explore-panel-content__cache-checking').removeClass('removed');

    // Timeout in case cache check takes a long time (more than 3s)
    setTimeout(() => {
      // Re-enable button
      this.geonaDiv.find('.js-geona-explore-panel-content__add-url').prop('disabled', false);
      this.geonaDiv.find('.js-geona-explore-panel-content__cache-checking').addClass('removed');
    }, 3000);

    urlInCache(this.geona.geonaServer, url)
      .then((cacheContent) => {
        // Re-enable button
        this.geonaDiv.find('.js-geona-explore-panel-content__add-url').prop('disabled', false);
        this.geonaDiv.find('.js-geona-explore-panel-content__cache-checking').addClass('removed');

        if (cacheContent) {
          // Show the label (with last cache time) and checkbox
          this.geonaDiv.find('.js-geona-explore-panel-content__cache-notification').removeClass('removed');
          let datetime = moment(cacheContent).toString();
          this.geonaDiv.find('.js-geona-explore-panel-content__cache-previous-datetime').html(datetime);
          this.geonaDiv.find('.js-geona-explore-panel-content__cache-checkbox').removeClass('removed');
          this.addLayerButtonTextAsUrl(false);
        } else {
          this.geonaDiv.find('.js-geona-explore-panel-content__cache-notification').addClass('removed');
          this.geonaDiv.find('.js-geona-explore-panel-content__cache-checkbox').addClass('removed');
          this.addLayerButtonTextAsUrl(true);
        }
      });
  }

  /**
   * Changes the Add URL button text depending on whether we will use the cache or not
   * @param {Boolean} useUrl True to display the text to use URL
   */
  addLayerButtonTextAsUrl(useUrl) {
    switch (useUrl) {
      case true:
        this.geonaDiv.find('.js-geona-explore-panel-content__add-url').html('Find Layers from URL');
        break;
      case false:
        this.geonaDiv.find('.js-geona-explore-panel-content__add-url').html('Find Layers from Cache');
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
        if (useCache) {
          // If the layer server was cached, it will be stored inside an Object, alongside the cache date
          layerServerInfo = JSON.parse(layerServerInfo.layerServerInfo);
        }

        // Show and populate the layer select dropdown and 'add layer' button
        this.geonaDiv.find('.js-geona-explore-panel-content__layer-select').removeClass('removed');
        this.geonaDiv.find('.js-geona-explore-panel-content__add-layer').removeClass('removed');
        let dropdown = this.geonaDiv.find('.js-geona-explore-panel-content__layer-select');
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
    let previousUrlLayersFound = this.geonaDiv.find('.js-geona-explore-panel-content__layer-select').contents().length > 0;
    if (previousUrlLayersFound === true) {
      this.geonaDiv.find('.js-geona-explore-panel-content__layer-select').empty().addClass('removed');
      this.geonaDiv.find('.js-geona-explore-panel-content__add-layer').addClass('removed');
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
        // Add to the layers panel list
        this.addLayerItem(layerIdentifier);
      }
    }
  }

  /**
   * Adds the layer in the 'available-layers' input box to the map.
   * @param {String} layerIdentifier The layer identifier for a Geona layer
   */
  addAvailableLayerToMap(layerIdentifier) {
    let layer = this.geona.map.availableLayers[layerIdentifier];
    let layerServer = this.geona.map.availableLayerServers[layer.layerServer];
    if (layer.modifier === 'hasTime') {
      this.geona.map.addLayer(layer, layerServer, {modifier: 'hasTime'});
    } else {
      this.geona.map.addLayer(layer, layerServer);
    }
    // Add to the layers panel list
    this.addLayerItem(layerIdentifier);
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
    // We will only show the layers tab if there are data layers active
    if (this.geona.map.config.data.length > 0) {
      // Switch the layers tab to be active
      this.geonaDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
      this.geonaDiv.find('.js-geona-menu__layers').addClass('geona-menu__tab--active');

      // Remove the current panel contents
      this.emptyCurrentPanel();

      // If the layers panel hasn't been created yet, we need to create it first
      if (this.layersPanel === undefined) {
        this.constructLayersPanel();
        this.layersPanel = this.geonaDiv.find('.js-geona-layers-list')[0];
      } else {
        // Show the already-made layers panel
        this.layersPanel.classList.remove('removed');
      }

      // The tab element being displayed
      let tabElement = this.layersPanelActiveItemTab;
      let item = '';
      let tab = 'none';
      if (tabElement) {
        // The item which holds the tab
        item = $(tabElement).closest('li')[0];

        // The tab name to put in the config
        if (tabElement.classList.contains('js-geona-layers-list__item-body-settings')) { // Settings tab
          tab = 'settings';
        } else if (tabElement.classList.contains('js-geona-layers-list__item-body-info')) { // Info tab
          tab = 'info';
        } else if (tabElement.classList.contains('js-geona-layers-list__item-body-analysis')) { // Analysis tab
          tab = 'analysis';
        }
      }

      // At this stage of the method we have loaded the correct panels and can use normal behaviour
      this.geona.loadingInitialMenu = false;

      // Update the config
      this.config.activePanel = {
        panel: 'layers',
        item: item.dataset.identifier,
        tab: tab,
      };
    } else {
      console.warn('Blocked the layers panel from opening as there are no active layers. It would be better to block the GUI (grey out the layers button) instead.');
    }
  }

  /**
   * Populates the layers panel with the active layer information.
   */
  constructLayersPanel() { // todo change to use map.config.data instead of activeLayersKeys double loop
    // Appends the layers panel itself
    this.geonaDiv.find('.js-geona-panel').append(templates.layers_panel());

    let activeLayersKeys = Object.keys(this.geona.map.activeLayers);
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

    // Set the active item tab
    // If we have it in the config we'll use that
    if (this.config.activePanel.item) {
      if (this.config.activePanel.tab === 'none') {
        this.layersPanelActiveItemTab = undefined;
      } else {
        // Find the list element for the config item
        let item = this.geonaDiv.find('.js-geona-layers-list__item[data-identifier="' + this.config.activePanel.item + '"]');
        // Find the tab that should be opened for this item
        this.layersPanelActiveItemTab = item.find('.js-geona-layers-list__item-body-' + this.config.activePanel.tab)[0];
      }
    } else {
      // Otherwise just find the topmost HTML element in the list to use for the default active layer
      let topmostItem = this.geonaDiv.find('.js-geona-layers-list').children()[0];
      this.layersPanelActiveItemTab = $(topmostItem).find('.js-geona-layers-list__item-body-info')[0];
    }

    // Set the triggers
    // fixme this only sets triggers for the items at the start, not any added after construction. Setting them again,
    //       however, sets the triggers multiple times for the items at the start.
    registerLayersTriggers(this.eventManager, this.geonaDiv);

    // Make its contents visible
    this.layersPanelActiveItemTab.classList.remove('removed');
  }

  /**
   * Adds a layer item to the layers panel list.
   * @param {String} layerIdentifier The identifier for the data layer we want to create an item for.
   */
  addLayerItem(layerIdentifier) {
    let geonaLayer = this.geona.map.availableLayers[layerIdentifier];
    let modifier = geonaLayer.modifier;
    if (modifier === 'basemap' || modifier === 'borders') {
      throw new Error('Cannot add a map layer item to the GUI for a basemap or borders layer! Use a layer with no modifier or a \'hasTime\' modifier instead.');
    } else {
      // Get the data in the correct format from the Geona layer
      let data = this._compileLayerData(geonaLayer);
      // Insert layer data object at the top of the list - higher on the list means higher on the map
      this.geonaDiv.find('.js-geona-layers-list').prepend(templates.layers_panel_item({data: data}));
      let item = this.geonaDiv.find('.js-geona-layers-list__item[data-identifier="' + layerIdentifier + '"]')[0];
      this.layersPanelItemList.unshift(layerIdentifier);

      let scalebar = new Scalebar(this, {
        layersPanelItem: item,
        layerIdentifier: layerIdentifier,
      });
      this.layersPanelScalebars[layerIdentifier] = scalebar;

      // fixme race condition from GetMetadata - results in scale ticks being NaN amongst other things
      scalebar.drawScalebar();

      // Update the elements on the item to reflect the current layer options
      // Update the logarithmic checkbox
      if (data.settings.logarithmic) {
        $(item).find('.js-geona-layers-list__item-body-settings__scale-logarithmic').prop('checked', true);
      }

      // Update the layer elevation selected value
      let elevationSelect = $(item).find('.js-geona-layers-list__item-body-settings-elevation-select');
      let elevationOptions = elevationSelect.find('option');
      for (let option of elevationOptions) {
        if (option.value === geonaLayer.currentElevation) {
          elevationSelect.val(option.value).prop('selected', true);
        }
      }

      // Update the layer style selected value
      let stylesSelect = $(item).find('.js-geona-layers-list__item-body-settings-styles-select');
      let stylesOptions = stylesSelect.find('option');
      for (let option of stylesOptions) {
        if (option.value === geonaLayer.currentStyle) {
          stylesSelect.val(option.value).prop('selected', true);
        }
      }

      // Update the below min selected value
      let belowMinSelect = $(item).find('.js-geona-layers-list__item-body-settings__below-min-color');
      switch (geonaLayer.scale.belowMinColor) {
        case geonaLayer.scale.aboveMaxColorDefault: {
          belowMinSelect.val('Default').prop('selected', true);
          break;
        }
        case '0x000000': {
          belowMinSelect.val('0x000000').prop('selected', true);
          break;
        }
        case '0xffffff': {
          belowMinSelect.val('0xffffff').prop('selected', true);
          break;
        }
        case 'transparent': {
          belowMinSelect.val('transparent').prop('selected', true);
          break;
        }
        default: {
          belowMinSelect.val('Custom').prop('selected', true);
          let belowMinHexBox = $(item).find('.js-geona-layers-list__item-body-settings__below-min-color-input__text');
          belowMinHexBox.val(geonaLayer.scale.belowMinColor);
          this.showBelowMinColorInput(item);
        }
      }

      // Update the above max selected value
      let aboveMaxSelect = $(item).find('.js-geona-layers-list__item-body-settings__above-max-color');
      switch (geonaLayer.scale.aboveMaxColor) {
        case geonaLayer.scale.aboveMaxColorDefault: {
          aboveMaxSelect.val('Default').prop('selected', true);
          break;
        }
        case '0x000000': {
          aboveMaxSelect.val('0x000000').prop('selected', true);
          break;
        }
        case '0xffffff': {
          aboveMaxSelect.val('0xffffff').prop('selected', true);
          break;
        }
        case 'transparent': {
          aboveMaxSelect.val('transparent').prop('selected', true);
          break;
        }
        default: {
          aboveMaxSelect.val('Custom').prop('selected', true);
          let aboveMaxHexBox = $(item).find('.js-geona-layers-list__item-body-settings__above-max-color-input__text');
          aboveMaxHexBox.val(geonaLayer.scale.aboveMaxColor);
          this.showAboveMaxColorInput(item);
        }
      }

      // Show or hide analysis controls
      if (geonaLayer.protocol !== 'wms') {
        $(item).find('.js-geona-layers-list__item-body-analysis__not-wms').removeClass('removed');
      } else if (geonaLayer.wcsUrl) {
        $(item).find('.js-geona-layers-list__item-body-analysis__controls').removeClass('removed');
      } else {
        $(item).find('.js-geona-layers-list__item-body-analysis__no-wcs-url').removeClass('removed');
      }

      // Hide all tabs
      $(item).find('.js-geona-layers-list__item-body-settings').addClass('removed');
      $(item).find('.js-geona-layers-list__item-body-info').addClass('removed');
      $(item).find('.js-geona-layers-list__item-body-analysis').addClass('removed');
    }
  }

  /**
   * Takes a Geona layer and constructs an object to use when displaying layer information on the layers list
   * @param {Layer}   geonaLayer The Geona layer definition to get information from.
   * @return {LayerData}            Object containing information used by the layer item template
   */
  _compileLayerData(geonaLayer) {
    // Compile data used in multiple tabs
    let layerCommon = {};
    // Elevation values
    if (geonaLayer.dimensions && geonaLayer.dimensions.elevation) {
      layerCommon.elevation = {};
      layerCommon.elevation.units = geonaLayer.dimensions.elevation.units;
      layerCommon.elevation.values = geonaLayer.dimensions.elevation.values;
    }

    // Compile data for the settings panel
    let layerSettings = {};

    // Min
    layerSettings.min = geonaLayer.scale.min;
    // Max
    layerSettings.max = geonaLayer.scale.max;
    // Logarithmic
    layerSettings.logarithmic = geonaLayer.scale.logarithmic;

    // Opacity
    layerSettings.opacityReal = this.geona.map.layerGet(geonaLayer.identifier, 'opacity');
    layerSettings.opacityPercent = Math.round(layerSettings.opacityReal * 100);

    // Styles
    if (geonaLayer.styles) {
      layerSettings.styles = [];
      for (let style of geonaLayer.styles) {
        layerSettings.styles.push(style.identifier);
      }
    }
    // Current style
    layerSettings.currentStyle = geonaLayer.currentStyle;

    // Below min color
    layerSettings.belowMinColor = '#' + geonaLayer.scale.belowMinColor.slice(2); // Removes the '0x' from the color code
    // Above max color
    layerSettings.aboveMaxColor = '#' + geonaLayer.scale.aboveMaxColor.slice(2); // Removes the '0x' from the color code

    // Number of color bands
    layerSettings.numColorBands = geonaLayer.scale.numColorBands;


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
    if (geonaLayer.dimensions) {
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
    let layerServer = this.geona.map.availableLayerServers[geonaLayer.layerServer];
    if (layerServer.service && layerServer.service.contactInformation) {
      layerInfo.contactInformation = layerServer.service.contactInformation;
    }

    // Return all
    return {
      common: layerCommon,
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
    for (let layerBox of this.geonaDiv.find('.js-geona-layers-list').children()) {
      this.layersPanelItemList.unshift(layerBox.dataset.identifier);
    }

    // Reorder the layers
    for (let index = 0; index < this.layersPanelItemList.length; index++) {
      if (this.layersPanelItemList[index] === item.dataset.identifier) {
        // If there's a basemap we need to increase the index by 1 (layersPanelItemList does not track basemaps)
        if (this.geona.map.config.basemap !== 'none') {
          this.geona.map.reorderLayers(item.dataset.identifier, index + 1);
        } else {
          this.geona.map.reorderLayers(item.dataset.identifier, index);
        }
      }
    }
  }

  /**
   * Opens the specified tab of the specified item.
   * @param {HTMLElement} item The item in the layers list.
   * @param {String}      tab  The name of the tab to open ('settings', 'info', 'analysis').
   */
  toggleLayersPanelItemTab(item, tab) {
    let itemTabToToggle = $(item).find('.js-geona-layers-list__item-body-' + tab)[0];
    let configItem = item.dataset.identifier;
    let configTab = tab;

    // If the item we want to toggle is the currently active tab, just close it
    if (itemTabToToggle.isEqualNode(this.layersPanelActiveItemTab)) {
      itemTabToToggle.classList.add('removed');
      this.layersPanelActiveItemTab = undefined;
      configItem = '';
      configTab = 'none';
    } else {
      if (this.layersPanelActiveItemTab !== undefined) {
        this.layersPanelActiveItemTab.classList.add('removed'); // Close the current tab
      }
      itemTabToToggle.classList.remove('removed'); // Open the new tab
      this.layersPanelActiveItemTab = itemTabToToggle;
    }

    // Update the config
    this.config.activePanel = {
      panel: 'layers',
      item: configItem,
      tab: configTab,
    };
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
   * @param {Boolean}     log  True if the scalebar is logarithmic.
   */
  setScalebarInputs(item, min, max, log) {
    $(item).find('.js-geona-layers-list__item-body-settings__scale-min').val(min);
    $(item).find('.js-geona-layers-list__item-body-settings__scale-max').val(max);
    $(item).find('.js-geona-layers-list__item-body-settings__scale-logarithmic').prop('checked', log);
    // TODO Collaboration - add eventManager call for collaboration (will use class variable to remove eslint complaint)
  }

  /**
   * Finds the min and max values and updates the scalebar and settings.
   * @param {HTMLElement} item The item for the layer being changed.
   */
  applyAutoScale(item) {
    let layerIdentifier = item.dataset.identifier;
    let geonaLayer = this.geona.map.availableLayers[layerIdentifier];

    this.layersPanelScalebars[layerIdentifier].getAutoScale()
      .then((minMaxObject) => {
        // We disable the autoscale box to show that the auto scale is active
        $(item).find('.js-geona-layers-list__item-body-settings__scale-auto-scale').prop('disabled', true);
        let min = minMaxObject.min;
        let max = minMaxObject.max;
        let log = geonaLayer.scale.logarithmicDefault;
        this.layersPanelScalebars[layerIdentifier].validateScale(min, max, log);
      })
      .catch((err) => {
        console.error('Unable to automatically find min and max values for layer ' + layerIdentifier + '. Returned error: ' + err);
        alert('Unable to automatically find min and max values for layer ' + layerIdentifier + '. Returned error: ' + err);
      });
  }

  /**
   * Unchecks and re-enables the auto scale checkbox for the specified item.
   * @param {HTMLElement} item The item for the layer being changed.
   */
  reEnableAutoScale(item) {
    $(item).find('.js-geona-layers-list__item-body-settings__scale-auto-scale').prop('checked', false);
    $(item).find('.js-geona-layers-list__item-body-settings__scale-auto-scale').prop('disabled', false);
    // TODO Collaboration - add eventManager call for collaboration (will use class variable to remove eslint complaint)
  }

  /**
   * Updates the datetime displayed above the scalebar for the specified layer item. Sets the displayed datetime to the
   * current layer time, or 'Invalid Time'.
   */
  updateLayersDatetimeGraphic() {
    // We will update each layer's time if needed
    for (let layerIdentifier of this.layersPanelItemList) {
      // Find the current layer time (this is the time which will be shown)
      let datetime;
      if (this.geona.map.availableLayers[layerIdentifier].modifier === 'hasTime') {
        datetime = this.geona.map.availableLayers[layerIdentifier].dimensions.time.loaded;
      }

      // Datetime might be undefined, so we'll either format the date nicely, or just set an 'Invalid Time' message
      let formattedDatetime;
      if (datetime) {
        formattedDatetime = moment(datetime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        formattedDatetime = 'Invalid Time'; // todo should be i18n-compatible
      }

      // Find the HTML Element to manipulate and update the displayed datetime
      let item = this.geonaDiv.find('.js-geona-layers-list__item[data-identifier="' + layerIdentifier + '"]');
      item.find('.js-geona-layers-list__item-scalebar-datetime')
        .html(formattedDatetime);
    }
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

  /**
   * Changes the layer elevation for the specified layer.
   * @param {String} layerIdentifier The identifier for the layer we want to update.
   * @param {Number} elevation       The elevation to change to.
   */
  changeLayerElevation(layerIdentifier, elevation) { // todo just trigger map function?
    // fixme add to layer changes buffer
    this.geona.map.changeLayerElevation(layerIdentifier, parseFloat(elevation));
  }

  // todo should this operate in the same way as changing min max log? As in, call scalebar.updateScalebar()?
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
   * @param {Array}    [params]        The parameters to call with the function.
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
  executeChangesBuffer(layerIdentifier) {
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
    let button = this.geonaDiv
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
    let button = this.geonaDiv
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
   * @param {String} item        The item for the layer we are altering.
   * @param {String} colorOption The value returned from the dropdown option.
   */
  setBelowMinColor(item, colorOption) {
    let layerIdentifier = item.dataset.identifier;
    let geonaLayer = this.geona.map.availableLayers[layerIdentifier];

    // Regex for matching '0x' followed by a valid hex code
    if (/0x(?:[0-9a-fA-F]{3}){1,2}/.test(colorOption) || colorOption === 'transparent') {
      geonaLayer.scale.belowMinColor = colorOption;
    } else if (/(?:[0-9a-fA-F]{3}){1,2}/.test(colorOption)) { // Regex for matching a valid hex code
      geonaLayer.scale.belowMinColor = '0x' + colorOption;
    } else if (colorOption === 'Default') {
      geonaLayer.scale.belowMinColor = geonaLayer.scale.belowMinColorDefault;
    } else {
      throw new Error('belowMinColor value of ' + colorOption + ' is not valid! Values must be one of \'0x[valid hex code]\', \'[valid hex code]\', \'transparent\' or \'Default\'.');
    }

    // Update the custom option color picker and input field
    let colorCode = geonaLayer.scale.belowMinColor.slice(2);
    this.updateBelowMinColorGraphic(item, colorCode);

    // Update the layer's below min color
    let scalebar = this.layersPanelScalebars[layerIdentifier];
    this.addToChangesBuffer(layerIdentifier, scalebar.updateScalebar, scalebar);
  }

  /**
   * Updates the GUI elements for choosing a custom below min color.
   * @param {HTMLElement} item      The item for the layer we want to update.
   * @param {HexColor}    colorCode The hexadecimal code for the color we want to change to.
   */
  updateBelowMinColorGraphic(item, colorCode) {
    $(item).find('.js-geona-layers-list__item-body-settings__below-min-color-input__text').val(colorCode);
    $(item).find('.js-geona-layers-list__item-body-settings__below-min-color-input__picker').val('#' + colorCode);
  }

  /**
   * Sets the color which should be returned from the server for data values above the current scale maximum.
   * @param {String} item        The item for the layer we are altering.
   * @param {String} colorOption The value returned from the dropdown option.
   */
  setAboveMaxColor(item, colorOption) {
    let layerIdentifier = item.dataset.identifier;
    let geonaLayer = this.geona.map.availableLayers[layerIdentifier];

    // Regex for matching '0x' followed by a valid hex code
    if (/0x(?:[0-9a-fA-F]{3}){1,2}/.test(colorOption) || colorOption === 'transparent') {
      geonaLayer.scale.aboveMaxColor = colorOption;
    } else if (/(?:[0-9a-fA-F]{3}){1,2}/.test(colorOption)) { // Regex for matching a valid hex code
      geonaLayer.scale.aboveMaxColor = '0x' + colorOption;
    } else if (colorOption === 'Default') {
      geonaLayer.scale.aboveMaxColor = undefined;
    } else {
      throw new Error('aboveMaxColor value of ' + colorOption + ' is not valid! Values must be one of \'0x[valid hex code]\', \'[valid hex code]\', \'transparent\' or \'Default\'.');
    }

    // Update the GUI color picker and input field
    let colorCode = geonaLayer.scale.belowMinColor.slice(2);
    this.updateAboveMaxColorGraphic(item, colorCode);

    // Update the layer's above max color
    let scalebar = this.layersPanelScalebars[layerIdentifier];
    this.addToChangesBuffer(layerIdentifier, scalebar.updateScalebar, scalebar);
  }

  /**
   * Updates the GUI elements for choosing a custom above max color.
   * @param {HTMLElement} item      The item for the layer we want to update.
   * @param {HexColor}    colorCode The hexadecimal code for the color we want to change to.
   */
  updateAboveMaxColorGraphic(item, colorCode) {
    $(item).find('.js-geona-layers-list__item-body-settings__above-max-color-input__text').val(colorCode);
    $(item).find('.js-geona-layers-list__item-body-settings__above-max-color-input__picker').val('#' + colorCode);
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
    let geonaLayer = this.geona.map.availableLayers[layerIdentifier];
    geonaLayer.scale.numColorBands = numColorBands;

    // Add the function to update scalebar to the buffer
    let scalebar = this.layersPanelScalebars[layerIdentifier];
    this.addToChangesBuffer(layerIdentifier, scalebar.updateScalebar, scalebar);

    // Update the color band box and slider
    $(item).find('.js-geona-layers-list__item-body-settings__color-bands-text').val(numColorBands);
    $(item).find('.js-geona-layers-list__item-body-settings__color-bands-slider').val(numColorBands);
  }

  /**
   * Verifies and submits a valid WCS URL, revealing the analysis controls for the corresponding layer. Also updates the
   * WCS URL for every layer on with the same layer server.
   * @param {HTMLElement} item The item for the layer we are updating.
   * @param {String}      url  The WCS URL that is being submitted.
   */
  submitWcsUrl(item, url) { // todo doesn't update other layer items that have already been loaded
    // todo add a bit of text saying 'WMTS layers cannot be analysed currently' to the GUI
    if (/(http:\/\/)|(https:\/\/)/.test(url)) { // regex to match 'http://' or 'https://'
      // Show the analysis controls
      $(item).find('.js-geona-layers-list__item-body-analysis__controls').removeClass('removed');
      $(item).find('.js-geona-layers-list__item-body-analysis__no-wcs-url').addClass('removed');

      // Update the WCS URL of the layers belonging to the same server as this item
      let layerIdentifier = item.dataset.identifier;
      let layerServer = this.geona.map.availableLayers[layerIdentifier].layerServer;

      for (let identifier of Object.keys(this.geona.map.availableLayers)) {
        let layer = this.geona.map.availableLayers[identifier];
        if (layer.layerServer === layerServer) {
          layer.wcsUrl = url;
        }
      }
    } else {
      console.error('WCS URL must begin with "http://" or "https://"');
      alert('WCS URL must begin with "http://" or "https://"');
    }
  }

  /**
   * ------------------------------------
   * Analysis Panel
   * ------------------------------------
   */

  /**
   * Shows the analysis panel on the GUI.
   */
  displayAnalysisPanel() {
    this.geonaDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.geonaDiv.find('.js-geona-menu__analysis').addClass('geona-menu__tab--active');

    this.emptyCurrentPanel();

    // If the analysis panel hasn't been created yet, we need to create it first
    if (this.analysisPanel === undefined) {
      this.constructAnalysisPanel();
      this.analysisPanel = this.geonaDiv.find('.js-geona-analysis-panel-content')[0];
    } else {
      // Add the analysis panel
      this.analysisPanel.classList.remove('removed');
    }

    // At this stage of the method we have loaded the correct panels and can use normal behaviour
    this.geona.loadingInitialMenu = false;

    // Update the config
    this.config.activePanel = {
      panel: 'analysis',
      item: '',
      tab: 'none',
    };
  }

  /**
   * Creates the analysis panel using the corresponding template.
   */
  constructAnalysisPanel() {
    this.geonaDiv.find('.js-geona-panel').prepend(templates.analysis_panel());
  }

  /**
   * ------------------------------------
   * Login Panel
   * ------------------------------------
   */

  /**
   * Opens the login panel on the GUI.
   */
  displayLoginPanel() {
    this.geonaDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.geonaDiv.find('.js-geona-menu__login').addClass('geona-menu__tab--active');

    this.emptyCurrentPanel();

    // If the login panel hasn't been created yet, we need to create it first
    if (this.loginPanel === undefined) {
      this.constructLoginPanel();
      this.loginPanel = this.geonaDiv.find('.js-geona-login-panel-content')[0];
    } else {
      // Add the login panel
      this.loginPanel.classList.remove('removed');
    }

    // At this stage of the method we have loaded the correct panels and can use normal behaviour
    this.geona.loadingInitialMenu = false;

    // Update the config
    this.config.activePanel = {
      panel: 'login',
      item: '',
      tab: 'none',
    };
  }

  /**
   * Creates the login panel using the corresponding template.
   */
  constructLoginPanel() {
    this.geonaDiv.find('.js-geona-panel').prepend(templates.login_panel());
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
    this.geonaDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.geonaDiv.find('.js-geona-menu__options').addClass('geona-menu__tab--active');

    this.emptyCurrentPanel();

    // If the options panel hasn't been created yet, we need to create it first
    if (this.optionsPanel === undefined) {
      this.constructOptionsPanel();
      this.optionsPanel = this.geonaDiv.find('.js-geona-options-panel-content')[0];
    } else {
      // Add the options panel
      this.optionsPanel.classList.remove('removed');
    }

    // At this stage of the method we have loaded the correct panels and can use normal behaviour
    this.geona.loadingInitialMenu = false;

    // Update the config
    this.config.activePanel = {
      panel: 'options',
      item: '',
      tab: 'none',
    };
  }

  /**
   * Creates the options panel using the corresponding template and data.
   */
  constructOptionsPanel() {
    let data = this._compileOptionsData();
    this.geonaDiv.find('.js-geona-panel').prepend(templates.options_panel({data: data}));

    // Sets the selected dropdown value to match the map's basemap
    for (let basemap of data.basemaps) {
      if (basemap.identifier === this.geona.map.config.basemap) {
        this.geonaDiv.find('.js-geona-options-panel-content__basemaps').val(basemap.identifier).prop('selected', true);
      }
    }

    // Sets the selected dropdown value to match the map's borders
    let bordersConfig = this.geona.map.config.borders;
    for (let border of data.borders) {
      for (let style of border.styles) {
        if (border.identifier === bordersConfig.identifier && style === bordersConfig.style) {
          this.geonaDiv.find('.js-geona-options-panel-content__borders').val(style).prop('selected', true);
        }
      }
    }

    // Check graticule box if enabled
    if (this.geona.map.config.graticule === true) {
      this.geonaDiv.find('.js-geona-options-panel-content__graticule').prop('checked', true);
    }

    // Select the correct projection dropdown option
    let projection = this.geona.map.config.projection;
    this.selectProjection(projection);

    // Set triggers
    registerOptionsTriggers(this.eventManager, this.geonaDiv);
  }

  /**
   * Compiles the data needed for the options panel template and returns an Object containing it.
   * @return {OptionsData} The basemap and borders information needed for the options panel template.
   */
  _compileOptionsData() {
    // Holds information about each basemap layer
    let basemaps = [];
    // Holds information about each borders layer
    let borders = [];

    // Loop through the available layers on the map
    for (let layerIdentifier of Object.keys(this.geona.map.availableLayers)) {
      let layer = this.geona.map.availableLayers[layerIdentifier];
      // We only take data from basemap and borders layers
      switch (layer.modifier) {
        case 'basemap': {
          let basemap = {
            identifier: layerIdentifier,
            title: selectPropertyLanguage(layer.title),
          };
          basemaps.push(basemap);
          break;
        }
        case 'borders': {
          let border = {
            identifier: layerIdentifier,
            title: selectPropertyLanguage(layer.title),
            styles: [],
          };
          for (let style of layer.styles) {
            border.styles.push(style.identifier);
          }
          borders.push(border);
          break;
        }
      }
    }

    let data = {
      basemaps: basemaps,
      borders: borders,
    };

    return data;
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
      let geonaLayer = this.geona.map.availableLayers[basemapIdentifier];
      let geonaLayerServer = this.geona.map.availableLayerServers[geonaLayer.layerServer];
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

      let geonaLayer = this.geona.map.availableLayers[bordersIdentifier];
      let geonaLayerServer = this.geona.map.availableLayerServers[geonaLayer.layerServer];
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
      this.geonaDiv.find('.js-geona-options-panel-content__projection').val(previousProjection).prop('selected', true);
    }
  }

  /**
   * Sets the selected projection option in the dropdown to the specified projection.
   * @param {String} projection The projection to switch the dropdown to.
   */
  selectProjection(projection) {
    this.geonaDiv.find('.js-geona-options-panel-content__projection').val(projection).prop('selected', true);
  }

  /**
   * ------------------------------------
   * Help Panel
   * ------------------------------------
   */

  /**
   * Shows the help panel on the GUI.
   */
  displayHelpPanel() {
    this.geonaDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.geonaDiv.find('.js-geona-menu__help').addClass('geona-menu__tab--active');

    this.emptyCurrentPanel();

    // If the help panel hasn't been created yet, we need to create it first
    if (this.helpPanel === undefined) {
      this.constructHelpPanel();
      this.helpPanel = this.geonaDiv.find('.js-geona-help-panel-content')[0];
    } else {
      // Add the help panel
      this.helpPanel.classList.remove('removed');
    }

    // At this stage of the method we have loaded the correct panels and can use normal behaviour
    this.geona.loadingInitialMenu = false;

    // Update the config
    this.config.activePanel = {
      panel: 'help',
      item: '',
      tab: 'none',
    };
  }

  /**
   * Populates the help panel.
   */
  constructHelpPanel() {
    this.geonaDiv.find('.js-geona-panel').prepend(templates.help_panel());
  }

  /**
   * ------------------------------------
   * Share Panel
   * ------------------------------------
   */

  /**
   * Shows the share panel on the GUI.
   */
  displaySharePanel() {
    this.geonaDiv.find('.geona-menu__tab--active').removeClass('geona-menu__tab--active');
    this.geonaDiv.find('.js-geona-menu__share').addClass('geona-menu__tab--active');

    this.emptyCurrentPanel();

    // If the share panel hasn't been created yet, we need to create it first
    if (this.sharePanel === undefined) {
      this.constructSharePanel();
      this.sharePanel = this.geonaDiv.find('.js-geona-share-panel-content')[0];
    } else {
      // Add the share panel
      this.sharePanel.classList.remove('removed');
    }

    // At this stage of the method we have loaded the correct panels and can use normal behaviour
    this.geona.loadingInitialMenu = false;

    // Update the config
    this.config.activePanel = {
      panel: 'share',
      item: '',
      tab: 'none',
    };
  }

  /**
   * Populates the share panel.
   */
  constructSharePanel() {
    this.geonaDiv.find('.js-geona-panel').prepend(templates.share_panel());
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


/* Type definitions for this class */

/**
 * @typedef {Object} MenuConfigOptions
 *   @property {Boolean} opened      Whether to load the menu opened or closed.
 *   @property {Boolean} allowToggle Whether to allow the menu to be toggled open or closed.
 */

/**
 * A 'this' context, which may be different from this Class instance's 'this' context.
 * @typedef {this} This
 */

/**
 * Contains information about data layers in the current Geona instance. Used when creating a Layers panel item on the
 * main menu.
 * @typedef {Object} LayerData
 *   @property {LayerDataSettings} settings Contains information needed to populate the settings tab for a layer.
 *   @property {LayerDataInfo}     info     Contains information needed to populate the info tab for a layer.
 */
/**
 * Contains all the information needed to populate the settings tab for a layer.
 * @typedef {Object} LayerDataSettings
 *   @property {Number}   min            The current minimum scale value.
 *   @property {Number}   max            The current maximum scale value.
 *   @property {Boolean}  logarithmic    Whether the scale is logarithmic or not.
 *   @property {Number}   opacityReal    The opacity as a Number between 0 and 1.
 *   @property {Number}   opacityPercent The opacity as a Number between 0 and 100.
 *   @property {String[]} styles         The identifiers for the styles for the layer.
 *   @property {String}   currentStyle   The currently-used style for the layer.
 *   @property {String}   belowMinColor  The color to use for values below the minimum value.
 *   @property {String}   aboveMaxColor  The color to use for values above the maximum value.
 *   @property {Number}   numColorBands  The number of color bands used in the scale.
 */
/**
 * Contains all the information needed to populate the info tab for a layer.
 * @typedef {Object} LayerDataInfo
 *   @property {String}            identifier           The identifier for the layer.
 *   @property {String}            [title]              The title or display name in the appropriate language.
 *   @property {BoundingBox}       [boundingBox]        The bounding box for the layer.
 *   @property {String}            [dateRange]          The date range for the layer in format 'X to Y' or 'X only'.
 *   @property {String}            [abstract]           The abstract in the appropriate language.
 *   @property {ContactInfomation} [contactInformation] The contact details of the data provider.
 */
/**
 * Contains North, East, South and West values to represent the bounding box for the layer.
 * @typedef {Object} BoundingBox
 *   @property {Number} north The highest latitude covered for the layer.
 *   @property {Number} east  The greatest longitude covered for the layer.
 *   @property {Number} south The lowest latitude covered for the layer.
 *   @property {Number} west  The lowest longitude covered for the layer.
 */
// todo check what's missing and what's optional in ContactInformation
/**
 * Contains contact details for the data provider.
 * @typedef {Object} ContactInfomation
 *   @property {String[]} email  The email addresses for the data provider.
 *   @property {String}   person The name of the data provider.
 *   @property {String[]} phone  The phone numbers for the data provider.
 */

/**
 * Contains information about basemap and borders layers in the current Geona instance. Used when creating the Options
 * panel on the main menu.
 * @typedef {Object} OptionsData
 *   @property {OptionsDataBasemaps[]} basemaps Contains Objects with an identifier and a title.
 *   @property {OptionsDataBorders[]}  borders  Contains Objects with an identifier, title and styles.
 */
/**
 * Contains an identifier and a title for a basemap layer available in the current Geona instance.
 * @typedef {Object} OptionsDataBasemaps
 *   @property {String} identifier The identifier for the basemap layer.
 *   @property {String} title      The correct-language title for the basemap layer.
 */
/**
 * Contains an identifier and a title for a borders layer available in the current Geona instance.
 * @typedef {Object} OptionsDataBorders
 *   @property {String}   identifier The identifier for the borders layer.
 *   @property {String}   title      The correct-language title for the borders layer.
 *   @property {String[]} styles     The identifiers for the styles for the borders layer.
 */

/**
  * A String containing 3 or 6 numbers and letters from 0 to 'f', representing red, green and blue (e.g. 00ff99)
  * @typedef {String} HexColor
  */
