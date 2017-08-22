import $ from 'jquery';
import handlebars from 'handlebars/runtime';
import * as templates from '../../templates/compiled';
import {registerHelpers} from '../../../common/hbs_helpers';
import {TermsAndConditionsTriggers} from './terms_and_conditions_triggers';
import {TermsAndConditionsBindings} from './terms_and_conditions_bindings';

registerHelpers(handlebars);

/**
 *
 */
export class TermsAndConditions {
  /**
   *
   * @param {*} termsAndConditionsConfigOptions
   * @param {*} parentDiv
   * @param {*} gui
   */
  constructor(termsAndConditionsConfigOptions, parentDiv, gui) {
    this.config = termsAndConditionsConfigOptions;
    this.parentDiv = parentDiv;
    this.gui = gui;

    this.parentDiv.html(templates.terms_and_conditions());
    let backgroundImage = this.config.backgroundImage;
    parentDiv.find('.js-geona-terms-and-conditions').css('background-image', 'url(' + backgroundImage + ')');

    this.termsAndConditionsTriggers = new TermsAndConditionsTriggers(gui.eventManager, parentDiv);
    this.termsAndConditionsBindings = new TermsAndConditionsBindings(gui.eventManager, this);
  }

  /**
   *
   */
  acceptTermsAndConditions() {
    this.parentDiv.find('.js-geona-terms-and-conditions').toggleClass('hidden', true);
    this.gui.loadMainScreen();
  }
}
