/**
 * Sets the triggers for events relating to the timeline.
 * @param {EventManager} eventManager The EventManager for the current map.
 * @param {JQuery} parentDiv The div which contains the current map.
 * @param {d3.Timeline} timebar The actual timebar
 */
export function registerTriggers(eventManager, parentDiv, timebar) {
  // Toggle timeline visibility
  parentDiv.find('.js-geona-timeline-toggle').click(() => {
    if (parentDiv.find('.js-geona-timeline').hasClass('hidden')) {
      eventManager.trigger('timeline.showTimeline');
    } else {
      eventManager.trigger('timeline.hideTimeline');
    }
  });

  // Show Pikaday widget
  parentDiv.find('.js-geona-timeline-current-date')
    .click(() => {
      eventManager.trigger('timeline.showPikaday');
    })
    .focusout(() => {
      eventManager.trigger('timeline.hidePikaday');
    });

  // Timebar - change time
  timebar.click(function(d, i, datum, selectedLabel, selectedRect, xVal) {
    eventManager.trigger('timeline.changeTime', xVal.toUTCString());
  });
  // timebar.on('timechanged', (properties) => {
  //   eventManager.trigger('timeline.changeTime', properties.time);
  // });
}
