/**
 * Sets the triggers for events relating to the GUI overlay.
 *
 * @param {EventManager} eventManager The EventManager for the current map.
 * @param {JQuery} parentDiv The div which contains the current map.
 */
export function registerTriggers(eventManager, parentDiv) {
  // Button - Start building map
  parentDiv.find('.js-geona-splash-screen__start-new').click(() => {
    eventManager.trigger('startNewMap');
  });
  // Button - Load previous map
  parentDiv.find('.js-geona-splash-screen__load-previous').click(() => {
    eventManager.trigger('loadPreviousMap');
  });
}
