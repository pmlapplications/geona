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

import 'jquery';
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
   * @param {Geona} geona The geona instance for this GUI.
   */
  constructor(configOptions, parentDiv, geona) {
    this.eventManager = new EventManager();
    this.configOptions = configOptions;
    this.parentDiv = parentDiv;
    this.geona = geona;
    this.gui = this;

    if (configOptions.get('intro.termsAndConditions.require')) {
      this.loadTermsAndConditionsScreen(configOptions, parentDiv, this);
    } else {
      this.loadMainScreen(configOptions, parentDiv, this);
    }
  }

  /**
   * Loads the terms and conditions template, and not the map, into the parent div.
   */
  loadTermsAndConditionsScreen() {
    let termsAndConditionsConfigOptions = this.configOptions.get('intro.termsAndConditions');
    this.termsAndConditions = new TermsAndConditions(termsAndConditionsConfigOptions, this.parentDiv, this.gui);
  }

  /**
   * Loads the required GUI elements for the map into the parent div.
   */
  loadMainScreen() {
    this.geona.initialiseMapDiv_(this.parentDiv);
    let overlayConfigOptions = Object.assign({},
      {splashScreen: this.configOptions.get('intro.splashScreen')},
    );
    let menuConfigOptions = this.configOptions.get('intro.menu');

    this.overlay = new Overlay(overlayConfigOptions, this.parentDiv, this.gui);
    this.mainMenu = new MainMenu(menuConfigOptions, this.parentDiv, this.gui);
  }
}
