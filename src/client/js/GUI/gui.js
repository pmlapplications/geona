/**
 * Notepad for classes required for GUI
 * - Timeline
 * - Overlay
 * - Uservoice?
 * - T&C
 */

import {TermsAndConditions} from './terms_and_conditions';
import {Overlay} from './overlay';
import {MainMenu} from './main_menu';
import {EventManager} from '../../../common/event_manager';

import $ from 'jquery';
import handlebars from 'handlebars/runtime';
import * as templates from '../../templates/compiled';
import {registerHelpers} from '../../../common/hbs_helpers';

registerHelpers(handlebars);

/**
  * Manages the elements of the GUI. An element is a distinct part of the GUI.
  * For example, the main menu is a different element than the timeline, but the layers list is not a different element
  * than the main menu.
  */
export class Gui {
  /**
   * Initialises all the elements of the GUI.
   * @param {Object} configOptions GUI-related settings from the config.
   * @param {*} parentDiv The element into which a map instance is placed.
   */
  constructor(configOptions, parentDiv) {
    this.eventManager = new EventManager();
    if (configOptions.get('intro.termsAndConditions.require')) {
      this.loadTermsAndConditionsScreen(configOptions, parentDiv, this);
    } else {
      this.loadMainScreen(configOptions, parentDiv, this);
    }
  }

  /**
   * Loads the terms and conditions template, and not the map, into the parent div.
   */
  loadTermsAndConditionsScreen(configOptions, parentDiv, gui) {
    let termsAndConditionsConfigOptions = configOptions.get('intro.termsAndConditions');
    let termsAndConditions = new TermsAndConditions(termsAndConditionsConfigOptions, parentDiv, gui);
  }

  /**
   * Loads the required GUI elements for the map into the parent div.
   */
  loadMainScreen(configOptions, parentDiv, gui) {
    let overlayConfigOptions = Object.assign({},
      configOptions.get('intro.splashScreen')
    );
    let menuConfigOptions = configOptions.get('intro.menu');

    this.overlay = new Overlay(overlayConfigOptions, parentDiv);
    this.mainMenu = new MainMenu(menuConfigOptions, parentDiv);
  }
}
