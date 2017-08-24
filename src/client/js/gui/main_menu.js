import 'jquery';
import 'jquery-ui/ui/widgets/sortable';
import handlebars from 'handlebars/runtime';
import * as templates from '../../templates/compiled';
import {registerHelpers} from '../../../common/hbs_helpers';
import {MainMenuTriggers} from './main_menu_triggers';
import {MainMenuBindings} from './main_menu_bindings';

registerHelpers(handlebars);

/**
 * Loads the templates and defines the functions relating to the main menu.
 */
export class MainMenu {
  /**
   *
   * @param {Object} menuConfigOptions The config settings relating to the main menu.
   * @param {JQuery} parentDiv The div containing the map.
   * @param {Gui} gui The parent Gui of this MainMenu.
   */
  constructor(geona, menuConfigOptions, parentDiv) {
    this.geona = geona;
    this.config = menuConfigOptions;
    this.parentDiv = parentDiv;
    this.gui = geona.gui;

    if (this.config.opened) {
      this.parentDiv.find('.js-geona-controls').append(templates.menu());
      this.parentDiv.find('.js-geona-menu').append(templates.panel());
      this.parentDiv.find('.js-geona-panel').addClass('hidden');
    }
    if (this.config.collapsible) {
      this.parentDiv.find('.js-geona-menu-bar').prepend(templates.menu_toggle());
      if (this.config.opened) {
        this.parentDiv.find('.js-geona-menu-toggle__icon')
          .removeClass('icon-arrow-65')
          .addClass('icon-arrow-66');
        this.parentDiv.find('.js-geona-menu-toggle__text').html('Close<br>Menu');
      }
    }


    this.triggers = new MainMenuTriggers(this.gui.eventManager, this.parentDiv);
    this.bindings = new MainMenuBindings(this.gui.eventManager, this);
  }

  /**
   * Makes menu visible.
   */
  openMenu() {
    this.parentDiv.find('.js-geona-menu').removeClass('hidden');
    this.parentDiv.find('.js-geona-menu-toggle__icon')
      .removeClass('icon-arrow-65')
      .addClass('icon-arrow-66');
    this.parentDiv.find('.js-geona-menu-toggle__text').html('Close<br>Menu');
  }

  /**
   * Removes menu from the GUI, but not from the DOM.
   */
  closeMenu() {
    this.parentDiv.find('.js-geona-menu').addClass('hidden');
    this.parentDiv.find('.js-geona-menu-toggle__icon')
      .removeClass('icon-arrow-66')
      .addClass('icon-arrow-65');
    this.parentDiv.find('.js-geona-menu-toggle__text').html('Open<br>Menu');
  }

  /**
   * Removes panel element from the GUI, but not from the DOM.
   */
  closePanel() {
    this.parentDiv.find('.js-geona-panel').addClass('hidden');
  }

  /**
   *
   */
  displayExplorePanel() {
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
    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');

    this.parentDiv.find('.js-geona-panel').prepend(templates.analysis_panel());
  }

  /**
   *
   */
  displayLoginPanel() {
    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');

    this.parentDiv.find('.js-geona-panel').prepend(templates.login_panel());
  }

  /**
   *
   */
  displayHelpPanel() {
    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');

    this.parentDiv.find('.js-geona-panel').prepend(templates.help_panel());
  }

  /**
   *
   */
  displaySharePanel() {
    this.parentDiv.find('.js-geona-panel')
      .empty()
      .removeClass('hidden');

    this.parentDiv.find('.js-geona-panel').prepend(templates.share_panel());
  }
}
