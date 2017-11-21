import 'jquery';
import * as d3 from 'd3';
import * as selection from 'd3-selection';
// const d3 = require('d3');
import moment from 'moment';
import pikaday from 'pikaday';
import 'pikaday-jquery';

/**
 * Creates an interactive Timebar used to manipulate layer time
 */
export class Timebar {
  /**
   * The Timebar is a chart to visualise events in time
   * @param {Timeline} timeline  The GUI timeline element
   * @param {*}        container The DOM element to insert the timebar into
   * @param {Object}   options   Timebar options in JSON format
   */
  constructor(timeline, container, options = {}) {
    // Ensure there can only be one Timebar per map
    if (timeline.timebar !== undefined) {
      throw new Error('There can be only one instance of a Timebar per map.');
    }

    // Set the defaults for options that have not been supplied
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
      timeMarkers: [],
    };

    this.timeline = timeline;
    this.parentDiv = timeline.parentDiv;
    this.options = Object.assign({}, defaults, options);

    // Used to hide range bars
    this.hiddenRangeBars = [];

    this.now = new Date();

    this.selectedDate = this.options.selectedDate;

    // The height for each lane of the chart (each lane contains the times for one layer)
    this.laneHeight = this.options.barHeight + this.options.barMargin * 2 + 1;
    // D3 colour categories scale with 10 contrasting colours
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);

    this.recalculateHeight();
    this.recalculateWidth();

    // Set the initial x scale (start date and end date)
    this.minDate = d3.min(this.options.timeMarkers, function(d) {
      return new Date(d.startDate);
    });
    this.maxDate = d3.max(this.options.timeMarkers, function(d) {
      return new Date(d.endDate);
    });
    // If no time markers, set the defaults for start and end date (6 months either side of selected date)
    if (this.minDate === undefined) {
      this.minDate = new Date(this.selectedDate.getTime() - 15778450000);
    }
    if (this.maxDate === undefined) {
      this.maxDate = new Date(this.selectedDate.getTime() + 15778450000);
    }
    // Sets up a D3 UTC Time scale
    //  Domain - the values we want to display
    //  Range - the screen space we have available to display them in
    //  Scale - the resizing function that fits the domain into the range
    this.xScale = d3.scaleUtc()
      // domain bounds (edges of possible values) set from earliest to latest date
      .domain([this.minDate, this.maxDate])
      // output range set to the width of the timebar
      .range([0, this.width]);


    // Set the initial y scale (height of the timebar)
    this.yScale = d3.scaleLinear()
      // domain bounds (edges of possible values) set to the edges of the number of time markers
      .domain([0, this.options.timeMarkers.length])
      // output range set to the height of the timebar
      .range([0, this.height]);


    // Used to prevent clickDate setting the date when dragging the date selector line or the whole timebar
    this.isDragging = false;

    this.zoom = d3.zoom()
      .on('zoom', () => {
        this.isDragging = true;
        this.redraw();
      })
      .on('end', () => {
        let startDate = this.xScale.invert(0);
        let endDate = this.xScale.invert(this.width);
        let params = {
          'event': 'timebar.zoom',
          'startDate': startDate,
          'endDate': endDate,
          'padding': false,
        };
        // FIXME trigger event ('timebar.zoom', params');
      });

    // let element = this.parentDiv.find('.js-geona-timeline-inner__timebar')[0];
    // element.append('svg');
    // element.attr('class', 'timeline');
    // element.class(this.zoom);
    // this.chart = element;
    this.chart = d3.select('div#' + this.id)
      .append('svg')
      .attr('class', 'timebar')
      .call(this.zoom);
    // .on('click', this.clickDate())
    // .on('mousedown', () => {
    //  isDragging = false;
    // });

    // Create the graphical drawing area for the widget (main)
    this.main = this.chart.append('svg:g')
      .attr('transform', 'translate(' + this.options.chartMargins.left + ',' + this.options.chartMargins.top + ')')
      .attr('class', 'main');


    // Separator line drawing initialisation
    this.separatorArea = this.main.append('svg:g');

    // Initialise the area to hold the range bars as horizontal timelines
    this.barArea = this.main.append('svg:g');

    // Initialise the fine-grained date-time detail bar area
    this.dateDetailArea = this.main.append('svg:g');


    // Initialise the fine-grained date-time detail bar area
    this.rangeBarArea = this.main.append('svg:g');

    // Initialise a vertical line through all timelines for today's date
    this.nowLine = this.main.append('svg:line').attr('class', 'nowLine');

    // Set up callback functions to handle dragging of a selected date-time marker
    this.draggedDate = this.selectedDate;

    // FIXME put in timebar_bindings/triggers
    this.selectedDateLine = this.main
      .append('svg:rect')
      .attr('cursor', 'e-resize')
      .attr('class', 'js-selected-date-line')
      // .call(
      //   d3.drag()
      //     .origin(Object)
      //     .on('drag', this.dragDate())
      //     .on('dragend', this.updateTimebarDates())
      // )
      .call(
        d3.drag()
          .subject(Object)
          .on('drag', this.dragDate())
          .on('dragend', this.updateTimebarDates())
      )
      .on('mousedown', () => {
        d3.event.stopPropagation();
      });

    // Initialise x-axis
    this.xAxis = d3.svg.axis().scale(this.xScale).orient('bottom').tickSize(6, 0, 0);
    this.main.append('svg:g')
      .attr('transform', 'translate(0,' + d3.round(this.height + 0.5) + ')')
      .attr('class', 'axis');

    // Set up x-axis time tick formats
    // Chooses the first format that returns a non-zero (true) value
    let customTimeFormat = d3.time.format.utc.multi([
      ['%H:%M:%S.%L', function(d) {
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

    // Initialise the time bar label area to the left of the timeline
    this.labelArea = this.main.append('svg:g');

    // Draw the graphical elements
    self.redraw();

    // Handle browser window resize event to dynamically scale the timeline chart along the x-axis
    // TODO Almost certainly doesn't work
    this.parentDiv.resize((event) => {
      // Change the widget width settings dynamically if the div is visible
      if (this.visible && event.target === this.parentDiv) {
        this.recalculateWidth();
        this.redraw();
      }
    });

    // // Set up the pikaday date input
    // this.parentDiv.find('.js-geona-timeline-current-date')
    //   .pikaday({
    //     format: 'YYYY-MM-DD HH:mm',
    //     use24hour: true,
    //     onSelect: function() {
    //       let selected = this.getMoment();
    //       // Convert selected into UTC as pikaday uses local time
    //       selected = moment.utc(selected.toArray());
    //       // FIXME trigger command to change date
    //     },
    //   });
  }

  /**
   * Recalculates the dynamic widget height
   */
  recalculateHeight() {
    let chartHeight = this.laneHeight * (this.options.timeMarkers.length);
    // Set a default height if there are no layers
    if (chartHeight === 0) {
      chartHeight = 25; // 25 pixels
    }
    // We add 20 pixels for the x-axis labels (layer titles)
    this.height = 20 + chartHeight + this.options.chartMargins.top + this.options.chartMargins.bottom;
  }

  /**
   * Recalculates the dynamic widget width
   */
  recalculateWidth() {
    // Get the current width from the timebar DOM element
    let chartWidth = this.parentDiv.find('.js-geona-timeline-inner__timebar').width();
    // Recalculate width
    this.width = (chartWidth - this.options.chartMargins.left - this.options.chartMargins.right);
  }

  /**
   * REMOVEME --- timeline functions should make use of this.isDragging
   * @param {*} d
   * @param {*} i
   */
  clickDate(d, i) {
    // TODO This shouldn't be here? The event functions should be in the timeline.js class
    // Remove this once it's clear how to replace it.
  }

  /**
   * Zoom the timebar to a date range.
   * To update only in one direction, just startDate or endDate can be provided with the other undefined.
   * @param {Date|String} startDate The earliest date to display on the timebar
   * @param {Date|String} endDate   The latest date to display on the timebar
   * @param {Boolean}     [padding] Whether to add padding to each end
   */
  zoomTimebar(startDate, endDate, padding) {
    let newStartDate;
    let newEndDate;

    if (startDate === null) {
      newStartDate = this.xScale.invert(0);
    } else {
      newStartDate = new Date(startDate);
    }
    if (endDate === null) {
      newEndDate = this.xScale.invert(this.width);
    } else {
      newEndDate = new Date(endDate);
    }

    if (padding === true) {
      // Set padding to be 5% of the difference between startDate and endDate
      let paddingAmount = (newEndDate.getTime() - newStartDate.getTime()) * 0.05;

      // Add the padding to both ends or just one if only extending in one direction
      if (startDate !== undefined) {
        newStartDate = newStartDate.getTime() - paddingAmount;
      }
      if (endDate !== undefined) {
        newEndDate = newEndDate.getTime() + paddingAmount;
      }
    }

    // Update the domain and range of the scale
    //  Domain - the values we want to display
    //  Range - the screen space we have available to display them in
    //  Scale - the resizing function that fits the domain into the range
    this.xScale
      .domain([newStartDate, newEndDate])
      .range([0, this.width]);
    // TODO zoom.x() no longer exists - if it's not working, you'll have to find an alternative to this line:
    // this.zoom.x(this.xScale);
    this.redraw();

    // TODO doesn't this cause an infinite loop?
    //   var params = {
    //     "event": "date.zoom",
    //     "startDate": startDate,
    //     "endDate": endDate,
    //     "noPadding": noPadding
    //  };
    //  gisportal.events.trigger('date.zoom', params);
  }

  /**
   * Functionality for dragging the date slider and using it to select a date.
   */
  dragDate() {
    this.isDragging = true;
    // Converts the position of the date into an x coordinate,
    // then adds the amount the bar has moved from its previous position
    let x = this.xScale(this.draggedDate) + selection.event.dx;

    // Prevent dragging the selector off the end of the row
    // TODO the < and > operators were switched in the original code. Should they be <= and >= instead?
    if (x < this.xScale.range()[0] && x > this.xScale.range()[1]) {
      x = x - d3.event.dx;
    }

    // Update the date based on new value of x
    this.draggedDate = this.xScale.invert(x);

    // Move the graphical marker
    this.selectedDateLine.attr('x', () => {
      return d3.round(self.xScale(this.draggedDate) - 1.5);
    });
    // Update the current timeline date
    this.parentDiv.find('.js-geona-timeline-current-date').val(moment.utc(this.draggedDate).format('YYYY-MM-DD HH:mm'));
  }

  /**
   * Sets the date of the layers to the selected date.
   */
  updateTimebarDates() {
    // Check that we've actually changed the date
    if (this.selectedDate !== this.draggedDate) {
      this.selectedDate = new Date(this.draggedDate);

      // Move the selector control
      if (this.selectedDate < this.xScale.invert(0)) {
        this.zoomTimebar(this.selectedDate, null);
      } else if (this.xScale.invert(this.width) < this.selectedDate) {
        this.zoomTimebar(null, this.selectedDate);
      }
      this.selectedDateLine.transition().duration(500).attr('x', () => {
        return d3.round(this.xScale(this.selectedDate) - 1.5);
      });

      // Update the map layers
      this.timeline.gui.geona.map.loadLayersToNearestValidTime(this.selectedDate.toString());
    }
  }
}
