/**
 * Sets the triggers for events relating to the terms and conditions screen.
 * @param {EventManager} eventManager The EventManager for the current map.
 * @param {JQuery} parentDiv The div which contains the current map.
 */
export function registerTriggers(eventManager, parentDiv) {
  // Button - Accept terms and conditions
  parentDiv.find('.js-geona-terms-and-conditions__accept').click(() => {
    eventManager.trigger('termsAndConditions.accept');
  });
}
