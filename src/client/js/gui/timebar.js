import 'jquery';
import * as d3 from 'd3';
// import * as selection from 'd3-selection';
// const d3 = require('d3');
import moment from 'moment';
import pikaday from 'pikaday';
import 'pikaday-jquery';
import * as d3Timelines from 'd3-timelines';

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

    this.drawTimebar(options);
  }

  /**
   * Constructs and draws the Timebar with the layer data on the page
   * @param {*} options Options for the timeline
   */
  drawTimebar(options) {
    if (options.data === undefined) {
      throw new Error('No layer data provided. Timebar will not be rendered.');
    } else {
      let width = this.parentDiv.find('.js-geona-timeline').width();
      console.log(width);
      this.timebar = d3Timelines.timelines()
        .width(width + 1)
        .tickFormat({
          tickTime: d3.utcDays,
          tickInterval: 7,
          tickSize: 4,
        })
        .stack()
        .margin({left: 70, right: 30, top: 0, bottom: 0});
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
