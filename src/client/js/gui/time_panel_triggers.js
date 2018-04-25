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

  // wreitme
  parentDiv.find('.js-geona-time-panel-options-prev-next__prev-far')
    .mouseover(() => {
      eventManager.trigger('timePanel.buttonPreviewTime', 'prev-far');
    })
    .click(() => {
      eventManager.trigger('timePanel.buttonChangeTime', 'prev-far');
    });

  // wreitme
  parentDiv.find('.js-geona-time-panel-options-prev-next__prev-short')
    .mouseover(() => {
      eventManager.trigger('timePanel.buttonPreviewTime', 'prev-short');
    })
    .click(() => {
      eventManager.trigger('timePanel.buttonChangeTime', 'prev-short');
    });

  // wreitme
  parentDiv.find('.js-geona-time-panel-options-prev-next__next-short')
    .mouseover(() => {
      eventManager.trigger('timePanel.buttonPreviewTime', 'next-short');
    })
    .click(() => {
      eventManager.trigger('timePanel.buttonChangeTime', 'next-short');
    });

  // wreitme
  parentDiv.find('.js-geona-time-panel-options-prev-next__next-far')
    .mouseover(() => {
      eventManager.trigger('timePanel.buttonPreviewTime', 'next-far');
    })
    .click(() => {
      eventManager.trigger('timePanel.buttonChangeTime', 'next-far');
    });
}
