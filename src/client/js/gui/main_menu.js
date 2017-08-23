import 'jquery';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/tabs';
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
   * @param {*} parentDiv The div containing the map.
   * @param {Gui} gui The parent Gui of this MainMenu.
   */
  constructor(menuConfigOptions, parentDiv, gui) {
    this.config = menuConfigOptions;
    this.parentDiv = parentDiv;
    this.gui = gui;

    if (this.config.opened) {
      parentDiv.find('.js-geona-controls').append(templates.menu({}));
      parentDiv.find('.js-geona-sidebar').tabs({
        collapsible: true,
        active: false,
      });
    } else if (this.config.collapsible) {
      parentDiv.find('.js-geona-controls').append(templates.menu_toggle_control({}));
      // TODO button onclick open menu and hide menu toggle control
    }

    this.triggers = new MainMenuTriggers(this.gui.eventManager, this.parentDiv);
    this.bindings = new MainMenuBindings(this.gui.eventManager, this);
  }

  appendLayersMenu() {

  }
}
