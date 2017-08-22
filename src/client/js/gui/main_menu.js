/**
 * Notepad for functions required for the main menu
 * From original geona.js:
 * - 
 *
 * Possible new functions:
 */
import $ from 'jquery';
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
   * @param {Object} menuConfigOptions The config settings relating to the main menu.
   * @param {*} parentDiv The div containing the map.
   */
  constructor(menuConfigOptions, parentDiv) {
    this.triggers = mainMenuTriggers;
    this.bindings = mainMenuBindings;
    this.config = menuConfigOptions;
  }

  appendLayersMenu() {

  }
}
