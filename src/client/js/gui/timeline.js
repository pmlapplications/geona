import $ from 'jquery';
import * as d3 from 'd3';
import d3xy from 'd3-xyzoom';
// import * as selection from 'd3-selection';
// const d3 = require('d3');
import moment from 'moment';
import 'pikaday-jquery';
import _ from 'lodash';

import {registerTriggers} from './timebar_triggers';
import {registerBindings} from './timebar_bindings';

/**
 * Creates an interactive Timeline used to manipulate layer dates
 */
export class Timeline {
  /**
   * The Timeline is a chart to visualise events in date
   * @param {Timeline} timePanel  The GUI date panel element
   * @param {Object}   options   Timeline options in JSON format
   */
  constructor(timePanel, options) {
    // Ensure there can only be one Timeline per map
    if (timePanel.timeline !== undefined) {
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

    this.geona = timePanel.geona;
    // TODO I think parentDiv is a bit misleading - maybe this.geonaDiv
    this.parentDiv = timePanel.parentDiv;

    /** @type {Object} Options used in construction of the map */
    this.options = Object.assign({}, defaults, options);

    /** @type {String} The name of the HTML element to create the timeline in */
    this.id = options.element;

    /** @type {Boolean} TODO */
    this.visible = options.visible;

    /** @type {Date} Today's date, displayed on the timeline as a single vertical line */
    this.now = new Date();

    /** @type {D3.xyz} TODO */
    this.layerbars = this.options.timebars.filter(function(element, index, array) {
      return element.type === 'layer';
    });

    /** @type {Number} TODO */
    this.laneHeight = this.options.barHeight + this.options.barMargin * 2 + 1;

    /** @type {D3.xyz} TODO */
    this.colors = d3.schemeCategory10; // TODO probably remove

    /** @type {xyz} TODO */
    this.width = undefined;
    this.recalculateWidth();
    /** @type {xyz} TODO */
    this.height = undefined;
    this.recalculateHeight();

    /** @type {xyz} TODO */
    this.isDragging = false;

    this.zoom = d3.zoom()
      .on('zoom', () => {
        this._zoomed();
      })
      .on('end', () => {
        let params = {
          event: 'date.zoom',
          startDate: this.xScale.invert(0),
          endDate: this.xScale.invert(this.width),
          noPadding: true,
        };
        this.geona.eventManager.trigger('date.zoom', params);
      });

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
    this.xScale = d3.scaleUtc().domain([this.minDate, this.maxDate]).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain([0, this.options.timebars.length]).range([0, this.height]);

    /** @type {xyz} TODO */
    this.chart = d3.select('div#' + this.id)
      .append('svg')
      .attr('class', 'timeline')
      .call(this.zoom)
      .on('click', this.clickDate)
      .on('mousedown', () => {
        this.isDragging = false;
      });

    /** @type {xyz} TODO */
    this.main = this.chart.append('svg:g')
      .attr('transform', 'translate(' + this.options.chartMargins.left + ',' + this.options.chartMargins.top + ')')
      .attr('class', 'main');

    /** @type {xyz} The area which holds the horizontal range bars */
    this.barArea = this.main.append('svg:g');

    /** @type {xyz} TODO */
    this.dateDetailArea = this.main.append('svg:g');

    /** @type {xyz} The line which marks today's date */
    this.nowLine = this.main.append('svg:line').attr('class', 'nowLine');

    /** @type {Date} The date the selectedDateLine is currently set to */
    this.draggedDate = this.options.selectedDate;

    /** @type {xyz} TODO */
    this.selectedDateLine = this.main.append('svg:rect').attr('cursor', 'e-resize').attr('class', 'selectedDateLine')
      .call(
        d3.drag().subject(Object)
          .on('drag', this.dragDate)
          .on('end', this.dragDateEnd)
      )
      .on('mousedown', function() {
        d3.event.stopPropagation();
      });

    // Initisalise x axis
    this.xAxis = d3.axisBottom().scale(this.xScale).tickSize(6, 0, 0);
    this.main.append('svg:g')
      .attr('transform', 'translate(0,' + d3Round(this.height + 0.5) + ')')
      .attr('class', 'axis');


    this.xAxis.tickFormat(multiDateFormat);

    this.draw();

    // TODO window.resize() trigger and binding
  }

  // Sort into Visual, Logical, and Interactive?

  clickDate(timelineSvg) {
    if (!this.isDragging) {
      let xPosition = d3.mouse(timelineSvg)[0]; // Gets the x position of where the mouse clicked

      // TODO what does this do vvv
      // If the xPosition is outside the bounds of the xScale we do something
      if (!this.xPositionWithinBounds(xPosition)) {
        xPosition = xPosition - d3.event.layerX;
      }

      // Set the new date and move the selectedDateLine
      this.draggedDate = this.xScale.invert(xPosition);
      this.setDate(this.draggedDate);
    }
  }

  // zoom() {
  //   return d3.zoom()
  //     .on('zoom', () => {
  //       this._zoomed();
  //     })
  //     .on('end', () => {
  //       let params = {
  //         event: 'date.zoom',
  //         startDate: this.xScale.invert(0),
  //         endDate: this.xScale.invert(this.width),
  //         noPadding: true,
  //       };
  //       this.geona.eventManager.trigger('date.zoom', params);
  //     });
  // }

  _zoomed() {
    let transform = d3.event.transform;
    this.xScale.domain(transform.rescaleX(this.xScale).domain());
    // TODO this might not be working, if not check zoomed() at https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
    this.isDragging = true;
    this.draw();
  }

  dragDate() { // TODO rename to drag selectedDateLine
    this.isDragging = true;
    let xPosition = this.xScale(this.draggedDate) + d3.event.dx; // the ?current x position? + the change in x

    // TODO what does this do vvv
    // If the xPosition is outside the bounds of the xScale we do something
    if (!this.xPositionWithinBounds(xPosition)) {
      xPosition = xPosition - d3.event.dx;
    }

    // Update the timeline date based on the new value of x
    this.draggedDate = this.xScale.invert(xPosition);

    // Move the selectedDateLine
    this.selectedDateLine.attr('x', () => {
      return d3Round(this.xScale(this.draggedDate) - 1.5);
    });

    // TODO this.geona.eventManager.trigger('some event to replace the line below');
    // $('.js-current-date').val(moment.utc(self.draggedDate).format('YYYY-MM-DD HH:mm'));
  }

  xPositionWithinBounds(xPosition) {
    if (xPosition < this.xScale.range()[0] || xPosition > this.xScale.range()[1]) {
      return false;
    }
    return true;
  }

  dragDateEnd() { // TODO could the line below just go in the selectedDateLine.on('dragend')? I reckon it could
    this.setDate(this.draggedDate);
  }

  draw() {
    // Calculate the correct x and y scales before new draw
    this.recalculateWidth();
    this.xScale.range([0, this.width]);
    this.yScale.domain([0, this.options.timebars.length]).range([0, this.height]);

    // Scale the chart and main drawing areas
    $('#' + this.id).height(this.chartHeight);
    this.main.attr('width', this.width).attr('height', this.height);
    this.chart.attr('width', this.chartWidth).attr('height', this.chartHeight)
      // Set the SVG clipping area to prevent drawing outside the bounds of the widget chart area
      .style('clip', 'rect( 0px, '
      + (this.width + this.options.chartMargins.left) + 'px, '
      + this.chartHeight + 'px, '
      + this.options.chartMargins.left + 'px)');

    // Scale the x-axis and define the x-scale label format
    this.main.selectAll('.axis').attr('transform', 'translate(0,' + d3Round(this.height + 0.5) + ')').call(this.xAxis);

    // Draw the timebars
    this.bars = this.barArea.selectAll('rect').data(this.options.timebars);
    this.bars
      .enter().append('svg:rect')
      .each((timebar, index) => {
        // timebar.color = timebar.color || this.colors(index);
        if (timebar.type === 'layer') {
          d3.select('rect').attr('y', ((timebar, index) => {
            return d3Round(this.yScale(index) + this.options.barMargin + 0.5);
          })(timebar, index));
          // .transition().duration(500)
          // .attr('height', d3Round(this.barHeight + 0.5))
          // .attr('stroke', ((timebar, index) => {
          //   return timebar.color || this.colors(index);
          // })(timebar, index))
          // .attr('class', 'timeRange');
        }
      });

    // Timebar removal
    this.bars.exit().remove();
    // Rescale the x values and widths of ALL the timebars
    this.bars
      .attr('x', (timebar) => {
        if (timebar.startDate) {
          let x = d3Round(this.xScale(new Date(timebar.startDate)) + 0.5);
          return x;
        } else {
          return 0;
        }
      }).attr('width', (timebar) => {
        if (timebar.endDate) {
          return d3Round(this.xScale(new Date(timebar.endDate)) - this.xScale(new Date(timebar.startDate)));
        } else {
          return 0;
        }
      });

    // Position the date date details lines (if available) for each date bar
    this.dateDetails = this.dateDetailArea.selectAll('g').data(this.options.timebars);

    // Add new required g elements
    this.dateDetails.enter().append('svg:g');

    // Remove unneeded g elements
    this.dateDetails.exit().remove();

    // Update all elements // TODO ask Olly or Ben about how updateLines gets d1 and i1 in the current portal
    this.dateDetailArea.selectAll('g').attr('d', (datum, index, selection) => {
      // To avoid the context of 'this' changing, we use this arrow function to call updateLines()
      console.log(datum);
      console.log(selection);
      console.log(index);
      return this.updateLines(selection, index);
    });


    // Rescale the x values for all the detail lines for each date bar // TODO rename the detail lines
    this.main.selectAll('.detailLine')
      .attr('x1', (date) => {
        return d3Round(this.xScale(new Date(date)) + 0.5);
      })
      .attr('x2', (date) => {
        return d3Round(this.xScale(new Date(date)) + 0.5);
      });

    // Draw the current date-date line
    let now = this.now; // xScale() overrides the 'this' context so we'll use these variables instead
    let height = this.height;

    this.nowLine // TODO would it be more readable to find a way of using xScale without context switching, using an arrow function?
      .attr('x1', d3Round(this.xScale(now) + 0.5)).attr('y1', 0)
      .attr('x2', d3Round(this.xScale(now) + 0.5)).attr('y2', height);

    // Draw the selected date-date line
    this.selectedDateLine
      .attr('x', () => {
        return d3Round(this.xScale(this.options.selectedDate) - 1.5);
      }).attr('y', 2)
      .attr('width', 10).attr('height', height - 2)
      .attr('rx', 6).attr('ry', 6);

    this.drawLabels();

    d3.select('div#' + this.id + ' .axis')
      .selectAll('.tick')
      .on('click', (date) => {
        d3.event.stopPropagation();
        this.setDate(date);
      });

    // TODO loadingfromstate thing
  }

  recalculateWidth() {
    this.chartWidth = $('div#' + this.id).width();
    this.width = this.chartWidth - this.options.chartMargins.right - this.options.chartMargins.left;
  }

  recalculateHeight() {
    this.height = this.laneHeight * this.options.timebars.length;
    // Height set to 25px if there are no timebars
    if (this.height === 0) {
      this.height = 25;
    }
    // The +20 pixels are to accomodate the axis labels
    this.chartHeight = this.height + this.options.chartMargins.top + this.options.chartMargins.bottom + 20;
  }

  getNextPreviousDate(increment = 0) { // getTimeAfterTraversal
    let newDate;
    let dateTimes;
    let layerIntervals = [];
    let layerNumber = 0;

    // Calculate the average interval for each layer on the timebar
    for (let timebar of this.options.timebars) {
      dateTimes = timebar.dateTimes;
      let startDate = timebar.startDate;
      let endDate = timebar.endDate;
      let interval = (endDate - startDate) / dateTimes.length;

      layerIntervals.push({
        layer: layerNumber,
        interval: interval,
      });
      layerNumber++;
    }

    // Sort the layers by their intervals
    layerIntervals.sort((a, b) => {
      return a.interval - b.interval;
    });

    // Find the best layer to use (best based on what criteria?) Ask Ben or Olly about this function
  }

  findLayerDateIndex(layer, selectedDate, dateTimes) {
    let layerDateIndex = -1;
    let times = dateTimes || this.options.timebars[layer].dateTimes;
    let startDate = this.options.timebars[layer].startDate;
    let endDate = this.options.timebars[layer].endDate;
    if (startDate <= selectedDate && selectedDate <= endDate) {
      for (let i = 0; i < times.length; i++) {
        let date = new Date(times[i]);
        if (date <= selectedDate) {
          layerDateIndex = i;
        }
      }
    }
    return layerDateIndex;
  }

  updateLines(timebar, index) {
    if (timebar.type === 'layer') {
      // Timebar
      let takenSpaces = {};
      let datetimes = timebar.dateTimes.filter((dateStr) => {
        let x = d3Round(this.xScale(new Date(dateStr)) + 0.5);
        if (takenSpaces[x] === true) {
          return false;
        }
        takenSpaces[x] = true;
        return (x > 0 && x < this.width);
      });

      // let g = d3.select(); // TODO finish method
    }
  }

  drawLabels() {
    // Draw the date bar labels
    $('.js-timeline-labels').html('');
    for (let i = 0; i < this.options.timebars.length; i++) {
      // Update label
      let positionTop = (i + 1) * (this.options.barHeight + this.options.barMargin);
      positionTop += (i + 1) * 3; // TODO what is this variable doing?
      let id = this.options.timebars[i].id;

      let label = $('.indicator-header[data-id="' + id + '"] > p').html();
      if (!label || label === '') {
        label = this.options.timebars[i].title;
      }
      // TODO finish method and figure out what it means
    }
  }

  reset() {
    this.zoom.translate([0, 0]).scale(1);
    this.recalculateHeight();
    this.recalculateWidth();
    this.draw();
    this.updateMinMaxDate();
  }

  updateMinMaxDate() {
    let dates = this.options.timebars.map((bar) => {
      return [
        bar.startDate,
        bar.endDate,
      ];
    }).reduce((startDate, endDate) => {
      return startDate.concat(endDate);
    }, []);

    let extent = d3.extent(dates);

    this.minDate = moment.utc(extent[0]).toDate();
    this.maxDate = moment.utc(extent[1]).toDate();
  }

  zoomDate(startDate, endDate, padding) {
    let newStartDate;
    let newEndDate;

    if (startDate === undefined) {
      newStartDate = this.xScale.invert(0);
    } else {
      newStartDate = new Date(startDate);
    }
    if (endDate === undefined) {
      newEndDate = this.xScale.invert(this.width);
    } else {
      newEndDate = new Date(endDate);
    }

    let paddingAmount = (newEndDate.getTime() - newStartDate.getTime()) * 0.05;

    if (padding) {
      if (startDate !== undefined) {
        newStartDate = newStartDate.getTime() - padding;
      }
      if (endDate !== undefined) {
        newEndDate = newEndDate.getTime() + padding;
      }
    }

    // let transform = d3.event.transform;
    // this.xScale.domain(transform.rescaleX(this.xScale).domain());
    // let transform = d3.zoomTransform();
    this.xScale.domain([newStartDate, newEndDate]).range([0, this.width]);
    this.draw();

    let params = {
      event: 'date.zoom',
      startDate: startDate,
      endDate: endDate,
      padding: padding,
    };

    this.geona.eventManager.trigger('date.zoom', params);
  }

  addLayerBar(title, id, startDate, endDate, dateTimes) {
    let newLayerBar = {};
    newLayerBar.title = title;
    newLayerBar.id = id;
    newLayerBar.startDate = startDate;
    newLayerBar.endDate = endDate;
    newLayerBar.dateTimes = dateTimes;
    newLayerBar.type = 'layer';
    newLayerBar.hidden = false;
    newLayerBar.color = '';

    this.options.timebars.push(newLayerBar);
    this.layerbars.push(newLayerBar);

    this.updateMinMaxDate();

    // TODO this has a TODO attached in the current code, so what should be changed?
    // TODO complete this if block (has some gisportal stuff in it)
    // if () {
    // this.recalculateHeight();
    // let data = this.layerbars[0];
    // this.zoomDate(data.startDate, data.endDate);
    // if (!moment.utc(this.getDate()).isBetween(moment.utc(startDate), moment.utc(endDate))) {
    //   this.setDate(endDate);
    // }
    // }

    if (!this.keydownListenerEnabled) {
      $(document).on('keydown', this.keydownListener);
      this.keydownListenerEnabled = true;
    }

    this.recalculateHeight();
    this.draw();

    // Adjust panel heights // FIXME there is 0% chance that .timeline-container exists
    this.parentDiv.find('.timeline-container').css('bottom', '0px');
    let height = this.parentDiv.find('.timeline-container').height() + 10; // +10 for the padding
    // this.adjustPanelCss(height);
  }

  has(title) {
    let has = _.filter(this.options.timebars, (d) => {
      return d.title.toLowerCase() === title.toLowerCase();
    });

    if (has.length > 0) {
      return true;
    }

    return false;
  }

  removeTimeBarById(id) { // TODO 
    // if (this.has(id)) {
    //   this.removeTimeBarByTitle(id);
    // } else if () [

    // }
  }

  removeTimeBarByTitle() {

  }

  removeByTitle() {

  }

  adjustPanelCss(height) { // FIXME find out what this does and fix
    this.parentDiv.find('.panel').css('bottom', height + 35 + 'px');
    this.parentDiv.find('.ol-attribution').css('bottom', height + 'px');
    let collabPanel = this.parentDiv.find('.collaboration-panel');
    let collabHidden = collabPanel.hasClass('hidden');
    let top = collabPanel.toggleClass('hidden', false).position().top;
    collabPanel.toggleClass('hidden', collabHidden);
    collabPanel.css('max-height', 'calc(100% - ' + (height + top + 35) + 'px)');
  }


  setDate(date) {
    if (this.getDate().toString() === date.toString()) {
      return false;
    }
    // TODO gisportal.hideAllPopups()
    // TODO if (this.options.timebars.length > 0 && !gisportal.loadingFromState) <-- this can just be the Geona instance

    if (this.options.timebars.length > 0) {
      if (date < this.xScale.invert(0)) {
        this.zoomDate(date, undefined);
      } else if (this.xScale.invert(this.width) < date) {
        this.zoomDate(undefined, date);
      }
      this.selectedDateLine.transition().duration(500).attr('x', (d) => {
        return d3Round(this.xScale(this.options.selectedDate) - 1.5);
      });
    }

    // TODO gisportal.filterLayersByTime(date)
    let params = {
      event: 'date.selected',
      date: date,
    };

    this.geona.eventManager.trigger('date.selected', params);
  }

  getDate() {
    let selectedDate = new Date(this.options.selectedDate);
    if (selectedDate instanceof Date) {
      return selectedDate;
    }
    return undefined;
  }
}

function d3Round(x, n) {
  // TODO replace with d3.format and a String-to-Number conversion
  console.log(x);
  console.log(n);
  if (n) {
    console.log(Math.round(x * (n = Math.pow(10, n))) / n);
    return Math.round(x * (n = Math.pow(10, n))) / n;
  }
  console.log(Math.round(x));
  return Math.round(x);
}

/**
 * Selects the appropriate date format depending on the precision of the date.
 * @param {*} date
 */
function multiDateFormat(date) {
  if (d3.timeSecond(date) < date) {
    return d3.timeFormat('%H:%M:%S.%L')(date);
  } else
  if (d3.timeMinute(date) < date) {
    return d3.timeFormat('%H:%M:%S')(date);
  } else
  if (d3.timeHour(date) < date) {
    return d3.timeFormat('%H:%M')(date);
  } else
  if (d3.timeDay(date) < date) {
    return d3.timeFormat('%H:%M')(date);
  } else
  if (d3.timeMonth(date) < date) {
    return d3.timeFormat('%Y-%m-%d')(date);
  } else {
    return d3.timeFormat('%b %Y')(date);
  }
}
