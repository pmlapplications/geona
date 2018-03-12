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
      eventManager.trigger('timePanel.buttonPrevFarPreviewTime');
    })
    .click(() => {
      eventManager.trigger('timePanel.buttonPrevFarChangeTime');
    });

  // wreitme
  parentDiv.find('.js-geona-time-panel-options-prev-next__prev-short')
    .mouseover(() => {
      eventManager.trigger('timePanel.buttonPrevShortPreviewTime');
    })
    .click(() => {
      eventManager.trigger('timePanel.buttonPrevShortChangeTime');
    });

  // wreitme
  parentDiv.find('.js-geona-time-panel-options-prev-next__next-short')
    .mouseover(() => {
      eventManager.trigger('timePanel.buttonNextShortPreviewTime');
    })
    .click(() => {
      eventManager.trigger('timePanel.buttonNextShortChangeTime');
    });

  // wreitme
  parentDiv.find('.js-geona-time-panel-options-prev-next__next-far')
    .mouseover(() => {
      eventManager.trigger('timePanel.buttonNextFarPreviewTime');
    })
    .click(() => {
      eventManager.trigger('timePanel.buttonNextFarChangeTime');
    });
}
