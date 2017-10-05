import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';
import * as templates from '../../templates/compiled';
import {registerTriggers} from './main_menu_triggers';
import {registerBindings} from './main_menu_bindings';

import LayerServer from '../../../common/layer/server/layer_server';
import LayerServerWmts from '../../../common/layer/server/layer_server_wmts';

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
  }

  /**
   * Requests layers from a WMS GetCapabilities request and creates a Geona Layer for each
   */
  getLayersFromWMS() {
    this.clearPreviousUrlLayers();
    let url = this.parentDiv.find('.js-geona-explore-panel-content__layer-url').val();
    $.ajax('http://127.0.0.1:7890/utils/wms/getLayers/' + encodeURIComponent(url))
      .done((serverConfig) => {
        let layers = new LayerServer(serverConfig);
        this.parentDiv.find('.js-geona-explore-panel-content__layer-select').removeClass('hidden');
        this.parentDiv.find('.js-geona-explore-panel-content__add-layer').removeClass('hidden');
        let dropdown = this.parentDiv.find('.js-geona-explore-panel-content__layer-select');
        for (let layer of layers.layers) {
          dropdown.append('<option value="' + layer.name + '">' + layer.name + '</option>');
          this.requestLayers.push(layer);
        }
      });
  }

  /**
   * Requests layers from a WMTS GetCapabilities request and creates a Geona Layer for each
   */
  getLayersFromWMTS() {
    this.clearPreviousUrlLayers();
    let url = this.parentDiv.find('.js-geona-explore-panel-content__layer-url').val();
    $.ajax('http://127.0.0.1:7890/utils/wmts/getLayers/' + encodeURIComponent(url))
      .done((serverConfig) => {
        let layers = new LayerServerWmts(serverConfig);
        this.parentDiv.find('.js-geona-explore-panel-content__layer-select').removeClass('hidden');
        this.parentDiv.find('.js-geona-explore-panel-content__add-layer').removeClass('hidden');
        let dropdown = this.parentDiv.find('.js-geona-explore-panel-content__layer-select');
        for (let layer of layers.layers) {
          dropdown.append('<option value="' + layer.identifier + '">' + layer.identifier + '</option>');
          this.requestLayers.push(layer);
        }
      });
  }

  /**
   * Checks whether there are already layers from a getLayersFromWMS/WMTS call, and removes them if so.
   * @return {Boolean} Whether there were previous layers found and removed
   */
  clearPreviousUrlLayers() {
    // TODO make private
    let previousUrlLayersFound = this.parentDiv.find('.js-geona-explore-panel-content__layer-select').contents().length > 0;
    if (previousUrlLayersFound === true) {
      this.parentDiv.find('.js-geona-explore-panel-content__layer-select').empty().addClass('hidden');
      this.parentDiv.find('.js-geona-explore-panel-content__add-layer').addClass('hidden');
      // Clears the array and removes all references to its previous values
      this.requestLayers.length = 0;
    }
    return previousUrlLayersFound;
  }

  /**
   * Adds the layer in the 'layer-select' input box to the map.
   */
  addUrlLayerToMap() {
    let selectedLayer = this.parentDiv.find('.js-geona-explore-panel-content__layer-select').val();
    for (let layer of this.requestLayers) {
      if (layer.name === selectedLayer || layer.identifier === selectedLayer) {
        this.geona.map.addLayer(layer);
      }
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
    // TODO remove line below once actually doing something
    this.parentDiv.find('.js-geona-layers-content').prepend(templates.layers_panel_item());
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
