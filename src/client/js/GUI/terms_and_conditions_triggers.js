import $ from 'jquery';

/**
 * Sets event triggers for main menu elements.
 */
export class TermsAndConditionsTriggers {
  /**
   *
   * @param {*} parentDiv The div which contains the map.
   */
  constructor(passedEventManager, parentDiv) {
    this.setAcceptTrigger(passedEventManager, parentDiv);
  }

  /**
   * Sets the trigger for the terms and conditions 'accept' button.
   * @param {*} eventManager The event manager which will set the trigger.
   * @param {*} parentDiv The element in which the current Geona map instance is placed.
   */
  setAcceptTrigger(eventManager, parentDiv) {
    parentDiv.find('.js-geona-sidebar__layers').click(() => {
      eventManager.trigger('acceptTermsAndConditions');
    });
  }
}
