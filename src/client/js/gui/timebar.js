import 'jquery';
import * as d3 from 'd3';
// import * as selection from 'd3-selection';
// const d3 = require('d3');
import moment from 'moment';
import 'pikaday-jquery';

import {registerTriggers} from './timebar_triggers';
import {registerBindings} from './timebar_bindings';

/**
 * Creates an interactive Timeline used to manipulate layer time
 */
export class Timeline {
  /**
   * The Timeline is a chart to visualise events in time
   * @param {Timeline} timebar  The GUI timebar element
   * @param {Object}   options   Timeline options in JSON format
   */
  constructor(timebar, options) {
    // Ensure there can only be one Timeline per map
    if (timebar.timeline !== undefined) {
      throw new Error('There can be only one instance of a Timeline per map.');
    }

    let defaults = {
      comment: 'Sample timeline data',
      selectedDate: new Date(),
      chartMargins: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      barHeight: 5,
      barMargin: 4,
      timebars: [],
    };

    /** @type {Object} Options used in construction of the map */
    this.options = Object.assign({}, defaults, options);

    /** @type {String} The name of the HTML element to create the timeline in */
    this.id = options.element; // TODO this will need to be the map div id + the element name

    /** @type {Boolean} TODO */
    this.visible = options.visible;

    /** @type {Date} Today's date, displayed on the timeline as a single vertical line */
    this.now = new Date();

    /** @type {D3.xyz} TODO */
    this.layerbars = this.options.timebars.filter(function(element, index, array) {
      return element.type === 'layer';
    });

    /** @type {Number} TODO */
    this.laneheight = this.options.barHeight + this.options.barMargin * 2 + 1;

    /** @type {D3.xyz} TODO */
    this.colours = d3.scale.category10();

    /** @type {xyz} TODO */
    this.chart = d3.select('div#' + this.id)
      .append('svg')
      .attr('class', 'timeline')
      .call(self.zoom)
      .on('click', self.clickDate)
      .on('mousedown', function() {
        this.isDragging = false;
      });

    /** @type {xyz} TODO */
    this.width = this.recalculateWidth();

    /** @type {xyz} TODO */
    this.height = this.recalculateHeight();

    /** @type {xyz} TODO */
    this.main = this.chart.append('svg:g')
      .attr('transform', 'translate(' + this.options.chartMargins.left + ',' + this.options.chartMargins.top + ')')
      .attr('class', 'main');

    /** @type {xyz} The area which holds the horizontal range bars */
    this.barArea = this.main.append('svg:g');

    /** @type {xyz} TODO */
    this.dateDetailArea = this.main.append('svg:g');

    /** @type {xyz} The line which marks today's time */
    this.nowLine = this.main.append('svg:line').attr('class', 'nowLine');

    /** @type {Date} The time the selectedDateLine is currently set to */
    this.draggedDate = this.options.selectedDate;

    /** @type {xyz} TODO */
    this.selectedDateLine = this.main.append('svg:rect').attr('cursor', 'e-resize').attr('class', 'selectedDateLine')
      .call(
        d3.behavior.drag().origin(Object)
          .on('drag', self.dragDate)
          .on('dragend', self.dragDateEnd)
      )
      .on('mousedown', function() {
        d3.event.stopPropagation();
      });

    /** @type {xyz} TODO */
    this.isDragging = false;

    /** @type {Date} TODO */
    this.minDate = undefined; // Initialised below
    /** @type {Date} TODO */
    this.maxDate = undefined; // Initialised below
    /** @type {xyz} TODO */
    this.xScale = undefined; // Initialised below
    /** @type {xyz} TODO */
    this.yScale = undefined; // Initialised below
    /** @type {xyz} TODO */
    this.xAxis = undefined; // Initisalised below

    // Initialise min/max dates
    this.minDate = d3.min(this.options.timebars, function(d) { // TODO rename d
      console.log(d);
      return new Date(d.startDate);
    });
    this.maxDate = d3.max(this.options.timebars, function(d) {// TODO rename d
      return new Date(d.endDate);
    });
    // Set some default max and min dates if no initial timebars (6 months either side of selected date)
    if (this.minDate === undefined || this.minDate === null) {
      this.minDate = new Date(this.options.selectedDate.getTime() - 15778450000);
    }
    if (this.maxDate === undefined || this.maxDate === null) {
      this.maxDate = new Date(this.options.selectedDate.getTime() + 15778450000);
    }

    // Initialise x and y scale
    this.xScale = d3.time.scale.utc().domain([this.minDate, this.maxDate]).range([0, this.width]);
    this.yScale = d3.scale.linear().domain([0, this.options.timebars.length]).range([0, this.height]);

    // Initisalise x axis
    d3.svg.axis().scale(this.xScale).orient('bottom').tickSize(6, 0, 0);
    this.main.append('svg:g')
      .attr('transform', 'translate(0,' + d3.round(this.height + 0.5) + ')')
      .attr('class', 'axis');

    // Set up xAxis time tick formats
    // Chooses the first format that returns a non-0 (true) value
    let customTimeFormat = d3.time.format.utc.multi([
      ['%H:%M:%S.%L', function(d) {
        console.log(d); // TODO rename d
        // HH:mm:ss.sss
        return d.getUTCMilliseconds();
      }],
      ['%H:%M:%S', function(d) {
        // HH:mm:ss
        return d.getUTCSeconds();
      }],
      ['%H:%M', function(d) {
        // HH:mm
        return d.getUTCMinutes();
      }],
      ['%H:%M', function(d) {
        // HH:mm
        return d.getUTCHours();
      }],
      ['%Y-%m-%d', function(d) {
        // YYYY-MM-DD
        return d.getUTCDate() !== 1;
      }],
      ['%b %Y', function() {
        // 3 letter month YYYY
        return true;
      }],
    ]);

    this.xAxis.tickFormat(customTimeFormat);

    this.draw();
  }

  // Sort into Visual, Logical, and Interactive?

  clickDate(timelineSvg) {
    if (!this.isDragging) {
      let xPosition = d3.mouse(timelineSvg)[0]; // Gets the x position of where the mouse clicked

      // TODO what does this do vvv
      // If the xPosition is outside the bounds of the xScale we do something
      if (xPosition < this.xScale.range()[0] || xPosition > this.xScale.range()[1]) {
        xPosition = xPosition - d3.event.layerX;
      }

      // Set the new date and move the selectedDateLine
      this.draggedDate = this.xScale.invert(xPosition);
      this.setDate(this.draggedDate);
    }
  }

  zoom() {
    d3.behavior.zoom()
      .x(this.xScale)
      .on('zoom', () => {
        this.isDragging = true;
        this.draw();
      })
      .on('zoomend', () => {
        let params = {
          event: 'date.zoom',
          startDate: this.xScale.invert(0),
          endDate: this.xScale.invert(this.width),
          noPadding: true,
        };
      });
  }

  dragDate() { // like eventListener?

  }

  dragDateEnd() { // like eventListener?

  }

  draw() {

  }

  recalculateWidth() {
    return null;
  }

  recalculateHeight() {
    return null;
  }

  keydownListener() {

  }

  getNextPreviousDate() { // getTimeAfterTraversal

  }

  updateLines() {

  }

  drawLabels() {

  }

  reset() {

  }

  updateMinMaxTime() {

  }

  zoomDate() {

  }

  addLayerBar() {

  }

  has() {

  }

  removeTimeBarById() {

  }

  removeTimeBarByTitle() {

  }

  removeByTitle() {

  }

  adjustPanelCss() {

  }

  setDate() {

  }

  hideAllPopups() {

  }

  filterLayersByDate() {

  }

  showDate() {

  }

  getDate() {

  }
}
