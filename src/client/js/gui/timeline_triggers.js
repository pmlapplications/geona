/**
 * Sets the triggers for events relating to the timeline.
 * @param {EventManager} eventManager The EventManager for the current map.
 * @param {JQuery} parentDiv The div which contains the current map.
 */
export function registerTriggers(eventManager, parentDiv) {
  // Div - Toggle timeline visibility
  parentDiv.find('.js-geona-timeline-toggle').click(() => {
    if (parentDiv.find('.js-geona-timeline').hasClass('hidden')) {
      eventManager.trigger('timeline.showTimeline');
    } else {
      eventManager.trigger('timeline.hideTimeline');
    }
  });

  // Timebar - Show Pikaday widget
  parentDiv.find('.js-geona-timeline-current-date')
    .click(() => {
      eventManager.trigger('timeline.showPikaday');
    })
    .focusout(() => {
      eventManager.trigger('timeline.hidePikaday');
    });
}
