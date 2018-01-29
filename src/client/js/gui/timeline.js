import 'jquery';
import * as templates from '../../templates/compiled';
import Pikaday from 'pikaday';
import moment from 'moment';

import {Timebar} from './timebar';
import {registerTriggers} from './timeline_triggers';
import {registerBindings} from './timeline_bindings';

/**
 * Creates the timeline section of the GUI.
 */
export class Timeline {
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
    this.map = gui.geona.map;

    this.parentDiv.append(templates.timeline());
    if (!this.config.opened) {
      this.parentDiv.find('.js-geona-timeline').addClass('hidden');
    }
    if (!this.config.collapsible) {
      this.parentDiv.find('.js-geona-timeline-toggle').remove();
    }

    // D3 Timeline
    this.timebar = new Timebar(this, {
      data: [
        {label: 'chlor_a', times: [{'starting_time': 1325376000000, 'ending_time': 1420070400000}]},
        {label: 'Rrs_412', times: [{'starting_time': 1356998400000, 'ending_time': 1451606400000}]},
        {label: 'MODIS_NOBS_SUM', times: [{'starting_time': 1262304000000, 'ending_time': 1420070400000}]},
      ],
    });


    // Pikaday widget - instantiated blank
    // TODO i18n for the pikaday
    this.pikaday = new Pikaday(
      {
        onSelect: (date) => {
          this.selectPikadayDate(date);
        },
      }
    );

    registerTriggers(this.gui.eventManager, this.parentDiv, this.timebar.timebar);
    registerBindings(this.gui.eventManager, this);
  }

  /**
   * Removes the timeline from view, but not from the DOM.
   */
  hideTimeline() {
    this.parentDiv.find('.js-geona-timeline').addClass('hidden');
  }

  /**
   * Shows the timeline on the GUI.
   */
  showTimeline() {
    this.parentDiv.find('.js-geona-timeline').removeClass('hidden');
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
  selectPikadayDate(date) {
    this.parentDiv.find('.js-geona-timeline-current-date')
      .val(date);

    // timebar update time
    // TODO

    // Update map layers
    let utcDate = moment.utc(date);
    this.map.loadLayersToNearestValidTime(utcDate);
  }

  /**
   * Changes current date and updates the map layers
   * @param {*} date The date to set the map to
   */
  setDate(date) {
    this.parentDiv.find('.js-geona-timeline-current-date')
      .val(date);

    // Update pikaday options so it displays correct time when next opened
    this.pikaday.setDate(date);

    // Update map layers
    let utcDate = moment.utc(date);
    this.map.loadLayersToNearestValidTime(utcDate);
  }

  /**
   * 
   * @param {String} time Time in vis Timeline format (e.g. Sun Dec 12 2010 23:57:22 GMT+0000 (GMT))
   */
  changeTime(time) {
    console.log('-------------time----------------');
    console.log(time);
    // console.log(new Date(time));
    this.geona.map.loadLayersToNearestValidTime(time);
  }
}
