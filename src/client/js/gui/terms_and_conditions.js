import * as templates from '../../templates/compiled';
import {registerBindings} from './terms_and_conditions_bindings';
import {registerTriggers} from './terms_and_conditions_triggers';

export class TermsAndConditions {
  constructor(gui, config) {
    this.gui = gui;

    gui.parentDiv.html(templates.terms_and_conditions());
    gui.parentDiv.find('.js-geona-terms-and-conditions').css('background-image', 'url(' + config.backgroundImage + ')');

    registerTriggers(gui.eventManager, gui.parentDiv);
    registerBindings(gui.eventManager, this);
  }

  accept() {
    this.gui.loadMainScreen();
  }
}
