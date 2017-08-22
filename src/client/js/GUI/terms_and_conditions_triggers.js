import 'jquery';

/**
 * Sets event triggers for terms and conditions elements.
 */
export class TermsAndConditionsTriggers {
  /**
   * Sets the triggers for events relating to the terms and conditions screen.
   *
   * @param {EventManager} eventManager The EventManager for the current map.
   * @param {*} parentDiv The div which contains the current map.
   */
  constructor(eventManager, parentDiv) {
    // Button - Accept terms and conditions
    parentDiv.find('.js-geona-terms-and-conditions__accept').click(() => {
      eventManager.trigger('acceptTermsAndConditions');
    });
  }
}
