import $ from 'jquery';
/**
 * Sets the triggers for events relating to the timePanel.
 * @param {EventManager} eventManager The EventManager for the current map.
 * @param {JQuery} parentDiv The div which contains the current map.
 */
export function registerTriggers(eventManager, parentDiv, timePanel) {
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
      eventManager.trigger('timePanel.stepChangeTime', 'prev-far');
    });

  // wreitme
  parentDiv.find('.js-geona-time-panel-options-prev-next__prev-short')
    .mouseover(() => {
      eventManager.trigger('timePanel.buttonPreviewTime', 'prev-short');
    })
    .click(() => {
      eventManager.trigger('timePanel.stepChangeTime', 'prev-short');
    });

  // wreitme
  parentDiv.find('.js-geona-time-panel-options-prev-next__next-short')
    .mouseover(() => {
      eventManager.trigger('timePanel.buttonPreviewTime', 'next-short');
    })
    .click(() => {
      eventManager.trigger('timePanel.stepChangeTime', 'next-short');
    });

  // wreitme
  parentDiv.find('.js-geona-time-panel-options-prev-next__next-far')
    .mouseover(() => {
      eventManager.trigger('timePanel.buttonPreviewTime', 'next-far');
    })
    .click(() => {
      eventManager.trigger('timePanel.stepChangeTime', 'next-far');
    });

  // keydown listener
  $(document).on('keydown', (key) => {
    // We need to check if the currently active element is this instance of Geona - if so, we can trigger on keydown
    let instanceActive = false;
    if (document.activeElement.id === parentDiv.attr('id')) { // Quick & easy - should work for OL, but not Leaflet
      instanceActive = true;
    } else if ($(document.activeElement).closest('.geona-container').attr('id') === parentDiv.attr('id')) {
      // If active element is in a Geona container, and the container has the same ID as our instance's container
      instanceActive = true;
    }

    // If this Geona instance is the active element
    if (instanceActive) {
      // TODO if the overlay is not visible and the collaboration overlay is not visible (from GISPortal)
      // if () {
      // If the timeline is instantiated and accepting keyboard commands
      if (timePanel.timeline && timePanel.timeline.options.keydownListenerEnabled) {
        switch (key.keyCode) {
          case 37:
            eventManager.trigger('timePanel.stepChangeTime', 'prev-short');
            break;
          case 39:
            eventManager.trigger('timePanel.stepChangeTime', 'next-short');
        }
      }
    // }
    }
  });
}
