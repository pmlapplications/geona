import 'jquery';
import * as templates from '../../templates/compiled';
import Pikaday from 'pikaday-time';
// import Pikaday from 'pikaday';
import moment from 'moment';

import {selectPropertyLanguage} from '../map_common';
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

    this.parentDiv.append(templates.timeline());
    if (!this.config.opened) {
      this.parentDiv.find('.js-geona-timeline').addClass('hidden');
    }
    if (!this.config.collapsible) {
      this.parentDiv.find('.js-geona-timeline-toggle').remove();
    }

    // Pikaday widget - instantiated blank
    // TODO i18n for the pikaday
    this.pikaday = new Pikaday(
      {
        field: this.parentDiv.find('.js-geona-timeline-current-date')[0],
        onSelect: (date) => {
          this.pikadayTriggeredChangeTime(date);
        },
      }
    );

    // If the map has loaded before the GUI we will miss the event fire, so check to see if we can draw the timebar yet
    if (this.geona.map) {
      if (this.geona.map.initialized) {
        this.drawTimebar();
      }
    }


    registerTriggers(this.geona.eventManager, this.parentDiv);
    registerBindings(this.geona.eventManager, this);
  }

  /**
   * Instantiates a new D3 Timeline object to use for the timebar.
   */
  drawTimebar() {
    // D3 Timeline
    let data = [];
    for (let activeLayerId of Object.keys(this.geona.map._activeLayers)) {
      let layer = this.geona.map._availableLayers[activeLayerId];
      if (layer.modifier === 'hasTime') {
        let title = selectPropertyLanguage(layer.title);
        let times = layer.dimensions.time.values;

        let layerData = {
          label: title,
          markerType: 'layer',
          times: [
            // {
            // starting_time: Math.round(new Date(times[0])), // Math.round() on a Date gives us the time in milliseconds
            // ending_time: Math.round(new Date(times[times.length - 1])),
          // }
          ],
        };
        for (let time of layer.dimensions.time.values) {
          let timeInMs = Math.round(new Date(time));
          layerData.times.push({
            markerType: 'time',
            starting_time: timeInMs,
            ending_time: timeInMs + 1,
          });
        }
        console.log(layerData);
        data.push(layerData);
      }
    }
    this.timebar = new Timebar(this, {
      data: data,
    });
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
  pikadayTriggeredChangeTime(date) {
    this.parentDiv.find('.js-geona-timeline-current-date')
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
    this.parentDiv.find('.js-geona-timeline-current-date')
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
    this.parentDiv.find('.js-geona-timeline-current-date').val(time);
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
