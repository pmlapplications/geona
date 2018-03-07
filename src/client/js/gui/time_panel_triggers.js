/**
 * Sets the triggers for events relating to the timePanel.
 * @param {EventManager} eventManager The EventManager for the current map.
 * @param {JQuery} parentDiv The div which contains the current map.
 */
export function registerTriggers(eventManager, parentDiv) {
  // Toggle timePanel visibility
  parentDiv.find('.js-geona-time-panel-toggle').click(() => {
    if (parentDiv.find('.js-geona-time-panel').hasClass('removed')) {
      eventManager.trigger('timePanel.showTimePanel');
    } else {
      eventManager.trigger('timePanel.hideTimePanel');
    }
  });

  // Show Pikaday widget
  parentDiv.find('.js-geona-time-panel-options-current-date')
    .click(() => {
      eventManager.trigger('timePanel.showPikaday');
    });
}
