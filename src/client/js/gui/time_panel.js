import 'jquery';
import * as templates from '../../templates/compiled';
import Pikaday from 'pikaday-time';
// import Pikaday from 'pikaday';
import moment from 'moment';

import {Timeline} from './timeline';
import {registerTriggers} from './time_panel_triggers';
import {registerBindings} from './time_panel_bindings';

/**
 * Creates the GUI time panel.
 */
export class TimePanel {
  /**
   * Creates the timeline depending on the config options.
   * @param {Gui} gui                      The Gui for this instance of Geona.
   * @param {Object} timelineConfigOptions The config options relating to timelines.
   */
  constructor(gui, timelineConfigOptions) {
    this.gui = gui;
    this.geona = gui.geona;
    this.config = timelineConfigOptions;
    this.parentDiv = gui.parentDiv;

    this.timeline = undefined;

    this.parentDiv.append(templates.time_panel());
    if (!this.config.opened) {
      this.parentDiv.find('.js-geona-time-panel').addClass('removed');
    }
    if (!this.config.collapsible) {
      this.parentDiv.find('.js-geona-time-panel-toggle').remove();
    }

    // Pikaday widget - instantiated blank
    // TODO i18n for the pikaday
    this.pikaday = new Pikaday(
      {
        field: this.parentDiv.find('.js-geona-time-panel-options-current-date')[0],
        format: 'YYYY-MM-DD HH-mm', // FIXME
        onSelect: (date) => {
          this.pikadayChangeTime(date);
        },
      }
    );

    // If the map has loaded before the GUI we will miss the event fire, so check to see if we can draw the timebar yet
    if (this.geona.map) {
      if (this.geona.map.initialized) {
        this.drawTimeline();
      }
    }

    registerTriggers(this.geona.eventManager, this.parentDiv);
    registerBindings(this.geona.eventManager, this);
  }

  /**
   *
   */
  drawTimeline() {
    // Assign ID to this instance's timeline container
    let instanceId = this.parentDiv.attr('id');
    this.parentDiv.find('.js-geona-time-panel-timeline').attr('id', instanceId + '-timeline-container');

    this.timeline = new Timeline(this, {
      elementId: instanceId + '-timeline-container',
    });

    for (let layerIdentifier of Object.keys(this.geona.map._activeLayers)) {
      if (this.geona.map._layerGet(layerIdentifier, 'modifier') === 'hasTime') {
        let availableLayer = this.geona.map._availableLayers[layerIdentifier];
        this.timeline.addTimelineLayer(availableLayer);
      }
    }
  }

  /**
   * Removes the timeline from view, but not from the DOM.
   */
  hideTimePanel() {
    this.parentDiv.find('.js-geona-time-panel').addClass('removed');
  }

  /**
   * Shows the timeline on the GUI.
   */
  showTimePanel() {
    this.parentDiv.find('.js-geona-time-panel').removeClass('removed');
  }

  /**
   * Shows the Pikaday widget
   */
  showPikaday() {
    this.pikaday.show();
  }

  /**
   * Hides the Pikaday widget
   */
  hidePikaday() {
    this.pikaday.hide();
  }

  /**
   * Sets the min and max dates for the pikaday based on the active layers min and max.
   * @param {String|Date} startDate The date to set as the minimum.
   * @param {String|Date} endDate   The date to set as the maximum.
   */
  setPikadayRange(startDate, endDate) {
    this.pikaday.setMinDate(new Date(startDate));
    this.pikaday.setMaxDate(new Date(endDate));
  }

  /**
   * Changes current date, updates the timeline and updates the map layers.
   * @param {String|Date} date The date to set the map to.
   */
  pikadayChangeTime(date) {
    this.parentDiv.find('.js-geona-time-panel-options-current-date')
      .val(date);

    // Update map layers
    let utcDate = moment.utc(date);
    this.geona.map.loadLayersToNearestValidTime(utcDate);

    // Update timeline display
    this.timelineUpdateTime(date); // todo rename timelineUpdateDisplay
  }

  /**
   * Changes the pikaday date without changing the map layers.
   * @param {String|Date} time
   */
  pikadayUpdateTime(time) {
    this.pikaday.setDate(time, true); // true parameter prevents 'onSelect' action on pikaday from triggering
  }

  /**
   * Called when the timeline is used to change the time.
   * Updates the pikaday and current-date text input, then calls mapUpdateTime()
   * @param {String} time Time in d3-timelines format (e.g. Sun Dec 12 2010 23:57:22 GMT+0000 (GMT))
   */
  timelineChangeTime(time) {
    this.pikadayUpdateTime(time);
    // update buttons
    this.parentDiv.find('.js-geona-time-panel-options-current-date').val(time);
    this.mapUpdateTime(time);
  }

  timelineUpdateTime(time) {
    this.timeline._moveSelectorToDate(time);
  }

  /**
   * Changes the times of the layers on the map
   * @param {String} time Time in d3-timelines format (e.g. Sun Dec 12 2010 23:57:22 GMT+0000 (GMT))
   */
  mapUpdateTime(time) {
    this.geona.map.loadLayersToNearestValidTime(time);
  }
}
