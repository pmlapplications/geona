import 'jquery';
import * as d3 from 'd3';
// import * as selection from 'd3-selection';
// const d3 = require('d3');
import moment from 'moment';
import pikaday from 'pikaday';
import 'pikaday-jquery';
import * as d3Timelines from 'd3-timelines';

import {registerTriggers} from './timebar_triggers';
import {registerBindings} from './timebar_bindings';

/**
 * Creates an interactive Timebar used to manipulate layer time
 */
export class Timebar {
  /**
   * The Timebar is a chart to visualise events in time
   * @param {Timeline} timeline  The GUI timeline element
   * @param {Object}   options   Timebar options in JSON format
   *   @property {Object} options.data Timebar data (layer name and times)
   */
  constructor(timeline, options) {
    // Ensure there can only be one Timebar per map
    if (timeline.timebar !== undefined) {
      throw new Error('There can be only one instance of a Timebar per map.');
    }

    this.timeline = timeline;
    this.geona = timeline.gui.geona;
    this.parentDiv = timeline.parentDiv;
    this.timebar = undefined;
    console.log(this.geona);
    console.log(this.geona.config.config_._instance.divId);

    this.drawTimebar(options, this.geona.eventManager);

    // registerTriggers(this.geona.eventManager, this.parentDiv, this);
    registerBindings(this.geona.eventManager, this.timeline);
  }

  // TODO ask Ben or Olly if they know of an alternative way of setting these .click() events (e.g. in the timebar_triggers.js class)
  /**
   * Constructs and draws the Timebar with the layer data on the page
   * @param {Object} options Options for the timeline
   * @param {EventManager} eventManager Geona eventManager for the .click functions
   */
  drawTimebar(options, eventManager) {
    if (options.data === undefined || options.data.length === 0) {
      throw new Error('No layer data provided. Timebar will not be rendered.');
    } else {
      let width = this.parentDiv.find('.js-geona-timeline').width();
      this.timebar = d3Timelines.timelines()
        .width(width + 1)
        .tickFormat({
          tickTime: d3.utcDays,
          tickInterval: 7,
          tickSize: 4,
        })
        .stack()
        .margin({left: 170, right: 30, top: 0, bottom: 0})
        .labelFormat((label) => {
          if (label.length > 25) {
            return label.slice(0, 22) + '...';
          }
          return label;
        })
        .colors(d3.scaleOrdinal().range(['#B1A7BC', '#32253F']))
        .click(function(d, i, datum, selectedLabel, selectedRect, xVal) {
          eventManager.trigger('timeline.timebarTriggeredChangeTime', xVal.toUTCString());
        });
      // .click(function(d, i, datum, selectedLabel, selectedRect, xVal) {
      //   console.log(xVal.toUTCString());
      //   console.log('timelineHover', datum.label);
      // });

      // Select within the map div id
      d3.select(this.geona.config.config_._instance.divId).select('.js-geona-timeline')
        .append('svg').attr('width', width)
        .datum(options.data).call(this.timebar);
    }
  }
}
