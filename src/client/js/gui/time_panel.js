import 'jquery';
import * as templates from '../../templates/compiled';
import Pikaday from 'pikaday-time';
// import Pikaday from 'pikaday';
import moment from 'moment';

import {selectPropertyLanguage} from '../map_common';
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
      this.parentDiv.find('.js-geona-time-panel').addClass('hidden');
    }
    if (!this.config.collapsible) {
      this.parentDiv.find('.js-geona-time-panel-toggle').remove();
    }

    // Pikaday widget - instantiated blank
    // TODO i18n for the pikaday
    this.pikaday = new Pikaday(
      {
        field: this.parentDiv.find('.js-geona-time-panel-current-date')[0],
        onSelect: (date) => {
          this.pikadayTriggeredChangeTime(date);
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

  drawTimeline() {
    // Assign ID to this instance's timeline container
    let instanceId = this.parentDiv.attr('id');
    this.parentDiv.find('.js-geona-time-panel-inner__timeline').attr('id', instanceId + '-timeline-container');
    this.timeline = new Timeline(this, {element: instanceId + '-timeline-container'});
  }

  /**
   * Removes the timeline from view, but not from the DOM.
   */
  hideTimePanel() {
    this.parentDiv.find('.js-geona-time-panel').addClass('hidden');
  }

  /**
   * Shows the timeline on the GUI.
   */
  showTimePanel() {
    this.parentDiv.find('.js-geona-time-panel').removeClass('hidden');
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
   * Sets the min and max dates for the pikaday based on the timebar min and max
   */
  setPikadayRange() {
    // TODO read description and do it
  }

  /**
   * Changes current date, updates the timebar and updates the map layers
   * @param {*} date The date to set the map to
   */
  pikadayTriggeredChangeTime(date) {
    this.parentDiv.find('.js-geona-time-panel-current-date')
      .val(date);

    // TODO timebar update time

    // Update map layers
    let utcDate = moment.utc(date);
    this.geona.map.loadLayersToNearestValidTime(utcDate);
  }

  /**
   * Changes current date and updates the map layers
   * @param {*} date The date to set the map to
   */
  setDate(date) {
    this.parentDiv.find('.js-geona-time-panel-current-date')
      .val(date);

    // Update pikaday options so it displays correct time when next opened
    this.pikaday.setDate(date);

    // Update map layers
    let utcDate = moment.utc(date);
    this.geona.map.loadLayersToNearestValidTime(utcDate);
  }

  /**
   * Called when the timebar is used to change the time.
   * Updates the pikaday and current-date text input, then calls mapChangeTime()
   * @param {String} time Time in d3-timelines format (e.g. Sun Dec 12 2010 23:57:22 GMT+0000 (GMT))
   */
  timebarTriggeredChangeTime(time) {
    this.pikaday.setDate(time);
    // update buttons
    this.parentDiv.find('.js-geona-time-panel-current-date').val(time);
    this.mapChangeTime(time);
  }

  /**
   * Changes the times of the layers on the map
   * @param {String} time Time in d3-timelines format (e.g. Sun Dec 12 2010 23:57:22 GMT+0000 (GMT))
   */
  mapChangeTime(time) {
    this.geona.map.loadLayersToNearestValidTime(time);
  }
}
