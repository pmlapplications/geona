/** @module terms_and_conditions */

import * as templates from '../../templates/compiled';
import {registerBindings} from './terms_and_conditions_bindings';
import {registerTriggers} from './terms_and_conditions_triggers';

/**
 * Loads the templates and defines the functions relating to the terms and conditions.
 */
export class TermsAndConditions {
  /**
   * Creates an instance of a terms and condition element to put on the GUI.
   * @param {Gui} gui The parent Gui of this MainMenu.
   * @param {Object} config The config options relating to terms and conditions.
   */
  constructor(gui, config) {
    this.gui = gui;
    this.geona = gui.geona;

    this.gui.geonaDiv.html(templates.terms_and_conditions());
    this.gui.geonaDiv.find('.js-geona-terms-and-conditions').css('background-image', 'url(' + config.backgroundImage + ')');

    registerTriggers(this.geona.eventManager, this.gui.geonaDiv);
    registerBindings(this.geona.eventManager, this);
  }

  /**
   * Loads the main screen, removing the terms and conditions element.
   */
  accept() {
    this.gui.loadMainScreen();
  }
}
