import * as templates from '../../templates/compiled';
import {registerBindings} from './terms_and_conditions_bindings';
import {registerTriggers} from './terms_and_conditions_triggers';

export class TermsAndConditions {
  constructor(gui, config) {
    this.gui = gui;

    this.gui.parentDiv.html(templates.terms_and_conditions());
    this.gui.parentDiv.find('.js-geona-terms-and-conditions').css('background-image', 'url(' + config.backgroundImage + ')');

    registerTriggers(this.gui.eventManager, this.gui.parentDiv);
    registerBindings(this.gui.eventManager, this);
  }

  accept() {
    this.gui.loadMainScreen();
  }
}
