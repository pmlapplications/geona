/**
 * Notepad for classes required for GUI
 * - Timeline
 * - Overlay
 * - Uservoice?
 * - T&C
 */

import * as TermsAndConditions from './terms_and_conditions';
import * as Overlay from './overlay';
import * as MainMenu from './main_menu';

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
    this.configOptions = configOptions;
    this.parentDiv = parentDiv;
    if (this.config.termsAndConditions.require) {
      this.loadTermsAndConditions(configOptions, parentDiv, this);
    } else {
      this.loadMainScreen(configOptions, parentDiv, this);
    }
  }

  /**
   * Loads the terms and conditions template, and not the map, into the parent div.
   */
  loadTermsAndConditionsScreen() {
    let termsAndConditionsConfigOptions = this.configOptions.intro.termsAndConditions;
    this.termsAndConditions = new TermsAndConditions(termsAndConditionsConfigOptions, this.parentDiv, this);
  }

  /**
   * Loads the required GUI elements for the map into the parent div.
   */
  loadMainScreen() {
    let overlayConfigOptions = Object.assign({},
      this.configOptions.intro.splashScreen
    );
    let menuConfigOptions = this.configOptions.intro.menu;

    this.overlay = new Overlay(overlayConfigOptions, this.parentDiv);
    this.mainMenu = new MainMenu(menuConfigOptions, this.parentDiv);
  }
}
