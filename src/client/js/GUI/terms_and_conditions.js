import $ from 'jquery';
import handlebars from 'handlebars/runtime';
import * as templates from '../../templates/compiled';
import {registerHelpers} from '../../../common/hbs_helpers';
import {termsAndConditionsTriggers} from './terms_and_conditions_triggers';
import {termsAndConditionsBindings} from './terms_and_conditions_bindings';

registerHelpers(handlebars);

export class TermsAndConditions {
  constructor(termsAndConditionsConfigOptions, parentDiv, gui) {
    this.triggers = termsAndConditionsTriggers;
    this.bindings = termsAndConditionsBindings;
    this.config = termsAndConditionsConfigOptions;
    this.parentDiv = parentDiv;
    this.gui = gui;

    this.parentDiv.html(templates.terms_and_conditions());
    let backgroundImage = this.config.get('intro.termsAndConditions.backgroundImage');
    parentDiv.find('.js-geona-terms-and-conditions').css('background-image', 'url(' + backgroundImage + ')');
  }

  acceptTermsAndConditions() {
    this.parentDiv.find('.js-geona-terms-and-conditions').toggleClass('hidden', true);
    this.gui.loadMainScreen();
  }
}
