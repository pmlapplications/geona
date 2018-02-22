import 'jquery';
import * as d3 from 'd3';

/**
 *
 */
export class Timeline {
  /**
   * 
   * @param {*} timePanel 
   * @param {*} settings 
   */
  constructor(timePanel, settings) {
    this.parentDiv = timePanel.parentDiv;

    let defaultOptions = {
      layers: [
        {
          identifier: 'chlor_a',
          title: 'chlor a title',
          allDates: [
            '1997-01-01',
            '2001-01-01',
            '2011-01-01',
            '2015-01-01',
          ],
        },
        {
          identifier: 'chlor_b',
          title: 'chlor b very long title',
          allDates: [
            '1999-01-01',
            '2002-01-01',
            '2012-01-01',
            '2013-01-01',
          ],
        },
        {
          identifier: 'chlor_c',
          title: 'chlor c title',
          allDates: [
            '1998-01-01',
            '2003-01-01',
            '2013-01-01',
            '2014-01-01',
          ],
        },
      ],
      timelineMargins: {
        top: 5,
        left: 0,
        right: 0,
        bottom: 0,
      },
    };
    /** @type {Object} Default options with custom settings if defined */
    this.options = Object.assign({}, defaultOptions, settings); // TODO write full list of options that can be passed in

    /** @type {Number} CONST - The pixel height for a layer on the timeline */
    this.LAYER_HEIGHT = 10;
    /** @type {Number} CONST - The pixel height for the padding between layers */
    this.LAYER_PADDING = 0.25;
    /** @type {Number} CONST - The pixel width needed to make room for the y-axis */
    this.Y_AXIS_LABEL_WIDTH = 100;
    /** @type {Number} CONST - The pixel height needed to make room for the x-axis */
    this.X_AXIS_LABEL_HEIGHT = 25;

    /** @type {Array} The currently active layer definitions shown on the timeline */
    this.timelineCurrentLayers = [];

    this.startDate = undefined;
    this.endDate = undefined;

    /** The width of the whole svg element created for the timeline */
    this.fullWidth = undefined;
    /** The width of only the section of the svg which contains the layers */
    this.dataWidth = undefined; // FIXME dataWidth cuts off the axis + labels
    this._calculateWidths();
    /** The height of the whole svg element created for the timeline */
    this.fullHeight = undefined;
    /** The height of only the section of the svg which contains the layers */
    this.dataHeight = undefined;
    this._calculateHeights();

    /** @type {Number} The minimum spacing ratio between x-axis labels */
    this.xAxisTicks = this.dataWidth / 160; // More information can be found on the Geona wiki
    // TODO could the extra width needed to display the full x-axis be calculated from xAxisTicks?

    // Set the scale for the xAxis to use
    this.xScale = d3.scaleTime()
      .range([this.Y_AXIS_LABEL_WIDTH, this.dataWidth])
      .domain([
        new Date('2010-01-01'),
        new Date('2011-01-01'),
      ]);

    this.xScale2 = d3.scaleTime()
      .range([this.Y_AXIS_LABEL_WIDTH, this.dataWidth])
      .domain([
        new Date('2010-01-01'),
        new Date('2011-01-01'),
      ]);


    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(this.xAxisTicks)
      .tickFormat(getDateFormat);


    this.yScale = d3.scaleBand() // Domain is not set because it will update as layers are added
      .range([0, this.dataHeight])
      .paddingInner(this.LAYER_PADDING);

    this.yAxis = d3.axisLeft(this.yScale)
      .ticks(this.timelineCurrentLayers.length);
    // Selects the main element to insert the timeline elements into
    this.zooming = false;
    let zoom = d3.zoom()
      .scaleExtent([0, Infinity])
      .translateExtent([[this.xScale(Date.parse('1500-01-01')), 0], [Infinity, this.dataHeight]])
      // .extent([[this.xScale(Date.parse('1500-01-01')), 0], [Infinity, this.dataHeight]])
      .on('zoom', () => { // Use arrow function to prevent 'this' context changing within zoom()
        this.zoom();
      })
      .on('end', () => {
        this.zooming = false;
      });
      // .scaleBy(d3.select('#' + this.options.elementId), 0.2);

    this.timeline = d3.select('#' + this.options.elementId)
      .append('svg')
      .attr('width', this.dataWidth)
      .attr('height', this.dataHeight)
      .call(zoom);

    // Add a group and draw the x axis
    this.timelineXAxisGroup = this.timeline.append('g')
      .attr('class', 'geona-timeline-x-axis')
      .attr('transform', 'translate(' + (this.Y_AXIS_LABEL_WIDTH) + ', ' + (this.fullHeight - this.X_AXIS_LABEL_HEIGHT) + ')')
      .call(this.xAxis);
    // Add a group and draw the y axis
    this.timelineYAxisGroup = this.timeline.append('g')
      .attr('class', 'geona-timeline-y-axis')
      .attr('transform', 'translate(' + this.Y_AXIS_LABEL_WIDTH + ')')
      .call(this.yAxis);
    this.timelineYAxisGroup.select('path.domain')
      .style('display', 'none');
    // Add a group for the layer bars
    this.timelineLayers = this.timeline.append('g')
      .attr('class', 'geona-timeline-layers');

    // Add the currently active layers
    for (let layer of this.options.layers) {
      this.addTimelineLayer(layer);
    }
  }

  /**
   * Adds the specified layer to the timeline
   * @param {*} layerToAdd
   */
  addTimelineLayer(layerToAdd) {
    // Increase timeline height to accommodate one new layer
    this.timelineCurrentLayers.push(layerToAdd);
    this._calculateHeights();
    // this.calculateTimelineExtent(layerToAdd);

    // Update xScale domain to show first layer's full extent
    if (this.timelineCurrentLayers.length === 1 && this.zooming === false) {
      this.xScale.domain([
        Date.parse(layerToAdd.allDates[0]),
        Date.parse(layerToAdd.allDates[layerToAdd.allDates.length - 1]),
      ]);
      this.xScale2.domain([
        Date.parse(layerToAdd.allDates[0]),
        Date.parse(layerToAdd.allDates[layerToAdd.allDates.length - 1]),
      ]);
    }
    // Update yScale range and domain
    this.yScale.range([0, this.dataHeight])
      .domain(this.timelineCurrentLayers.map((layer) => {
        return layer.title;
      }));

    this.timelineLayerSelection = this.timelineLayers.selectAll('.geona-timeline-layer');
    // Create a g for each layer
    this.timelineLayerBars = this.timelineLayerSelection
      .remove().exit()
      .data(this.timelineCurrentLayers)
      .enter().append('g')
      .attr('class', (layer) => {
        return 'geona-timeline-layer geona-timeline-layer__' + layer.identifier;
      })
      .attr('transform', (layer) => {
        return 'translate(0, ' + this.yScale(layer.title) + ')';
      })

      // Within the g create a rect
      .append('rect')
      .attr('x', (layer) => {
        return this.xScale(Date.parse(layer.allDates[0]));
      })
      .attr('y', 0) // Alignment is relative to the group, so 0 always refers to the top position of the group.
      .attr('height', this.LAYER_HEIGHT)
      .attr('width', (layer) => {
        let startDateXPosition = this.xScale(Date.parse(layer.allDates[0]));
        let endDateXPosition = this.xScale(Date.parse(layer.allDates[layer.allDates.length - 1]));
        return endDateXPosition - startDateXPosition;
      })
      .attr('fill', '#b1a7bc').attr('shape-rendering', 'crispEdges')
      .attr('class', 'geona-timeline-layer-bar');

    this.timeline.attr('height', this.fullHeight); // Increase the height of the SVG element so we can view all layers
    this.timeline.select('.geona-timeline-x-axis')
      .attr('transform', 'translate(0, ' + (this.fullHeight - this.X_AXIS_LABEL_HEIGHT) + ')');
    this.timeline.select('.geona-timeline-x-axis')
      .call(this.xAxis);
    this.timeline.select('.geona-timeline-y-axis')
      .call(this.yAxis);

    for (let layer of this.timelineCurrentLayers) {
      this._addTimeStepMarkers(layer, layer.allDates);
    }
  }

  /**
   * @private
   *
   * Adds the time step marker elements for the specified layer. Filters the dates used so only one line is drawn for
   * a particular pixel (prevents overlapping lines).
   * @param {Object} layer    The definition for the layer we are using.
   * @param {Array}  allDates The collection of dates to insert markers for.
   */
  _addTimeStepMarkers(layer, allDates) {
    // Holds x pixels which have been used by another date in allDates
    let uniquePixels = new Set();
    // Only holds dates which will be drawn on different x pixels
    let filteredDates = [];

    // We will check each date to see if it would be drawn on the same x pixel as another date
    for (let date of allDates) {
      let xPixel = Math.floor(this.xScale(Date.parse(date)));
      if (!uniquePixels.has(xPixel)) {
        // This pixel is currently free, so we will draw a line for this date
        uniquePixels.add(xPixel);
        filteredDates.push(date);
      }
    }

    // We will append a line to the layer bar for each date remaining after being filtered
    this.timelineLayers.select('.geona-timeline-layer__' + layer.identifier).selectAll('line')
      .data(filteredDates)
      .enter().append('line')
      .attr('x1', (date) => {
        let xPosition = Math.floor(this.xScale(Date.parse(date)));
        return xPosition;
      })
      .attr('x2', (date) => {
        let xPosition = Math.floor(this.xScale(Date.parse(date)));
        return xPosition;
      })
      .attr('y1', 0)
      .attr('y2', this.LAYER_HEIGHT)
      .attr('stroke', '#000000')
      .attr('stroke-width', '1')
      .attr('shape-rendering', 'crispEdges')
      .attr('class', 'geona-timeline-layer-time-marker');
  }

  /**
   * @private
   * Updates the dataWidth and fullWidth variables to keep the correct proportions for the window size.
   */
  _calculateWidths() {
    this.dataWidth = this.parentDiv.find('.js-geona-time-panel-container').width() -
      this.options.timelineMargins.left - this.options.timelineMargins.right -
      this.Y_AXIS_LABEL_WIDTH;
    this.fullWidth = this.parentDiv.find('.js-geona-time-panel-container').width();
  }

  /**
   * @private
   * Updates the dataHeight and fullHeight variables to keep the correct proportions for the window size.
   */
  _calculateHeights() {
    this.dataHeight = this.LAYER_HEIGHT * this.timelineCurrentLayers.length;
    this.fullHeight = this.dataHeight +
      this.options.timelineMargins.top + this.options.timelineMargins.bottom +
      this.X_AXIS_LABEL_HEIGHT;
  }

  /**
   * Sets the startDate and endDate to the
   * @param {Array}   times 
   * @param {Boolean} [padding]
   */
  calculateTimelineExtent(times, padding) {

  }

  /**
   * Handles panning and zooming along the x axis. Called on 'zoom' event.
   */
  zoom() {
    // We translate each layer along the x axis, and scale each layer horizontally
    // Update the domain based on the newly-transformed scale
    this.xScale.domain(d3.event.transform.rescaleX(this.xScale2).domain()); // TODO see if there's a nice way of updating this.xScale2 around the place
    // Update the x-axis display
    this.timelineXAxisGroup.call(this.xAxis);

    // Adjust the positioning of the layer bars
    this.timelineLayers.selectAll('.geona-timeline-layer-bar')
      .attr('x', (layer) => {
        let startDate = layer.allDates[0];
        return this.xScale(Date.parse(startDate));
      })
      .attr('width', (layer) => {
        let startDate = layer.allDates[0];
        let endDate = layer.allDates[layer.allDates.length - 1];
        return this.xScale(Date.parse(endDate)) - this.xScale(Date.parse(startDate));
      });

    // TODO make it only redraw if the zoom level changed, rather than if it was purely a pan
    // Remove the time markers - we need to redraw completely in case of pixel overlap (more info on wiki)
    this.timelineLayers.selectAll('.geona-timeline-layer-time-marker')
      .remove().exit();
    // Add time markers back
    for (let layer of this.timelineCurrentLayers) {
      this._addTimeStepMarkers(layer, layer.allDates);
    }
  }
}

/**
 * Selects the appropriate date format depending on the precision of the date.
 * @param {*} date
 */
function getDateFormat(date) {
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
