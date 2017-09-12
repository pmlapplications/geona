import 'jquery';
import 'jquery-ui/ui/widgets/sortable';
import handlebars from 'handlebars/runtime';
import * as templates from '../../templates/compiled';
import {registerHelpers} from '../../../common/hbs_helpers';
import {mainMenuTriggers} from './main_menu_triggers';
import {mainMenuBindings} from './main_menu_bindings';

registerHelpers(handlebars);

/**
 * Loads the templates and defines the functions relating to the main menu.
 */
export class MainMenu {
  /**
   *
   * @param {Geona} gui The parent Gui of this MainMenu.
   * @param {Object} menuConfigOptions The config settings relating to the main menu.
   * @param {JQuery} parentDiv The div containing the map.
   */
  constructor(gui, menuConfigOptions) {
    this.gui = gui;
    this.geona = gui.geona;
    this.config = menuConfigOptions;
    this.parentDiv = gui.parentDiv;

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
    mainMenuTriggers(this.gui.eventManager, this.parentDiv);
    mainMenuBindings(this.gui.eventManager, this);
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

  /**
   *
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
