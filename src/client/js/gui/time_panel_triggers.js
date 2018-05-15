import $ from 'jquery';
/**
 * Sets the triggers for events relating to the timePanel.
 * @param {EventManager} eventManager The EventManager for the current map.
 * @param {JQuery}       geonaDiv    The div which contains the current map.
 * @param {TimePanel}    timePanel    The Geona TimePanel these triggers correspond to.
 */
export function registerTriggers(eventManager, geonaDiv, timePanel) {
  /**
   * Some triggers are set within the main TimePanel methods:
   *  - 'timePanel.timeChanged' - pikadayChangeTime(), timelineChangeTime(), stepChangeTime()
   */

  // Toggle timePanel visibility
  geonaDiv.find('.js-geona-time-panel-toggle').click(() => {
    if (geonaDiv.find('.js-geona-time-panel').hasClass('removed')) {
      eventManager.trigger('timePanel.showTimePanel');
    } else {
      eventManager.trigger('timePanel.hideTimePanel');
    }
    eventManager.trigger('timePanel.heightChanged');
  });

  // Show Pikaday widget
  geonaDiv.find('.js-geona-time-panel-options-current-date')
    .click(() => {
      eventManager.trigger('timePanel.showPikaday');
    });

  // Preview and change time based on the step value corresponding to prev-far
  geonaDiv.find('.js-geona-time-panel-options-prev-next__prev-far')
    .mouseover(() => {
      eventManager.trigger('timePanel.stepPreviewTime', 'prev-far');
    })
    .click(() => {
      eventManager.trigger('timePanel.stepChangeTime', 'prev-far');
    });

  // Preview and change time based on the step value corresponding to prev-short
  geonaDiv.find('.js-geona-time-panel-options-prev-next__prev-short')
    .mouseover(() => {
      eventManager.trigger('timePanel.stepPreviewTime', 'prev-short');
    })
    .click(() => {
      eventManager.trigger('timePanel.stepChangeTime', 'prev-short');
    });

  // Preview and change time based on the step value corresponding to next-short
  geonaDiv.find('.js-geona-time-panel-options-prev-next__next-short')
    .mouseover(() => {
      eventManager.trigger('timePanel.stepPreviewTime', 'next-short');
    })
    .click(() => {
      eventManager.trigger('timePanel.stepChangeTime', 'next-short');
    });

  // Preview and change time based on the step value corresponding to next-far
  geonaDiv.find('.js-geona-time-panel-options-prev-next__next-far')
    .mouseover(() => {
      eventManager.trigger('timePanel.stepPreviewTime', 'next-far');
    })
    .click(() => {
      eventManager.trigger('timePanel.stepChangeTime', 'next-far');
    });

  // keydown listener
  $(document).on('keydown', (key) => {
    // We need to check if the currently active element is this instance of Geona - if so, we can trigger on keydown
    let instanceActive = false;
    if (document.activeElement.id === geonaDiv.attr('id')) { // Quick & easy - should work for OL, but not Leaflet
      instanceActive = true;
    } else if ($(document.activeElement).closest('.geona-container').attr('id') === geonaDiv.attr('id')) {
      // If active element is in a Geona container, and the container has the same ID as our instance's container
      instanceActive = true;
    }

    // If this Geona instance is the active element
    if (instanceActive) {
      // TODO if the overlay is not visible and the collaboration overlay is not visible (from GISPortal - timeline.js, line 379)
      // if () {
      // If the timeline is instantiated and accepting keyboard commands
      if (timePanel.timeline
        && timePanel.timeline.options.keydownListenerEnabled
        && timePanel.timeline.timelineCurrentLayers.length > 0) { // TODO replace key.keyCode (deprecated) https://stackoverflow.com/questions/35394937/javascript-keycode-deprecated-what-does-this-mean-in-practice
        switch (key.keyCode) {
          case 37: // Left arrow key
            eventManager.trigger('timePanel.stepChangeTime', 'prev-short');
            break;
          case 39: // Right arrow key
            eventManager.trigger('timePanel.stepChangeTime', 'next-short');
        }
      }
      // }
    }
  });
}
