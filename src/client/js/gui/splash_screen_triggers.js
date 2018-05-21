/**
 * Sets the triggers for events relating to the GUI overlay.
 *
 * @param {EventManager} eventManager The EventManager for the current map.
 * @param {JQuery} geonaDiv The div which contains the current map.
 */
export function registerTriggers(eventManager, geonaDiv) {
  // Button - Start building map
  geonaDiv.find('.js-geona-splash-screen__start-new').click(() => {
    eventManager.trigger('splashScreen.startNewMap');
  });
  // Button - Load previous map
  geonaDiv.find('.js-geona-splash-screen__load-previous').click(() => {
    eventManager.trigger('splashScreen.loadPreviousMap');
  });
}
