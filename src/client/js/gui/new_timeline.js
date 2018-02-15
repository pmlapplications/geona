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
          title: 'chlor b title',
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
    this.options = Object.assign({}, defaultOptions, settings);

    this.LAYER_HEIGHT = 10; // CONST
    this.Y_AXIS_LABEL_WIDTH = 100; // CONST
    this.X_AXIS_LABEL_HEIGHT = 25; // CONST
    this.LAYER_PADDING = 0.3; // CONST - between 0 and 1
    this.X_AXIS_TICKS = 7; // TODO explain on wiki // CONST
    // this.X_AXIS_TICKS = Math.round(this.dataWidth / 77); // TODO explain on wiki // CONST

    this.timelineCurrentLayers = [];
    this.startDate = undefined;
    this.endDate = undefined;

    this.dataWidth = undefined; // Calculated in calculateWidths() // TODO jsdoc these
    this.fullWidth = undefined; // Calculated in calculateWidths()
    this.calculateWidths();
    this.dataHeight = undefined; // Calculated in calculateHeights() // TODO jsdoc these
    this.fullHeight = undefined; // Calculated in calculateHeights()
    this.calculateHeights();

    // this.xZoom = d3.zoom() // use http://bl.ocks.org/jgbos/9752277 http://emptypipes.org/2016/07/03/d3-panning-and-zooming/
    //   .on('zoom', this.zoom);

    // Set the scale for the xAxis to use
    this.xScale = d3.scaleTime()
      .domain([
        new Date(new Date('2010-01-01')),
        new Date(new Date('2011-01-01')),
      ])
      .range([this.Y_AXIS_LABEL_WIDTH, this.dataWidth]); // FIXME dataWidth cuts off the axis + labels

    this.xScale2 = d3.scaleTime()
      .domain([
        new Date(new Date('2010-01-01')),
        new Date(new Date('2011-01-01')),
      ])
      .range([this.Y_AXIS_LABEL_WIDTH, this.dataWidth]);

    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(this.X_AXIS_TICKS)
      .tickFormat(getDateFormat);


    this.yScale = d3.scaleBand() // Domain is not set because it will update as layers are added
      .range([0, this.dataHeight])
      .paddingInner(this.LAYER_PADDING);

    this.yAxis = d3.axisLeft(this.yScale)
      .ticks(this.timelineCurrentLayers.length);
    // Selects the main element to insert the timeline elements into
    this.zooming = false;
    let zoom = d3.zoom()
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
    this.timeline.append('g')
      .attr('class', 'geona-timeline-y-axis')
      .attr('transform', 'translate(' + this.Y_AXIS_LABEL_WIDTH + ')')
      .call(this.yAxis);
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
    this.calculateHeights();
    // this.calculateTimelineExtent(layerToAdd);

    // TODO v make this true v
    // Update xScale domain to show first layer's full extent
    if (this.timelineCurrentLayers.length === 1 && this.zooming === false) {
      this.xScale.domain([Date.parse(layerToAdd.allDates[0]), Date.parse(layerToAdd.allDates[layerToAdd.allDates.length - 1])]);
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

    console.log(this.xScale(Date.parse('2010-01-01')));
  }

  /**
   * @private
   *
   * Adds the time step marker elements for the specified layer.
   * @param {Object} layer    The definition for the layer we are using.
   * @param {Array}  allDates The collection of dates to insert markers for.
   */
  _addTimeStepMarkers(layer, allDates) {
    this.timelineLayers.select('.geona-timeline-layer__' + layer.identifier).selectAll('line')
      .data(allDates)
      .enter().append('line')
      .attr('x1', (date) => {
        return this.xScale(Date.parse(date));
      })
      .attr('x2', (date) => {
        return this.xScale(Date.parse(date));
      })
      .attr('y1', 0)
      .attr('y2', this.LAYER_HEIGHT)
      .attr('stroke', '#000000')
      .attr('stroke-width', '1')
      .attr('shape-rendering', 'crispEdges')
      .attr('class', 'geona-timeline-layer-time-marker');
  }

  /**
   * Updates the dataWidth and fullWidth variables to keep the correct proportions for the window size.
   */
  calculateWidths() {
    this.dataWidth = this.parentDiv.find('.js-geona-time-panel-container').width() -
      this.options.timelineMargins.left - this.options.timelineMargins.right -
      this.Y_AXIS_LABEL_WIDTH;
    this.fullWidth = this.parentDiv.find('.js-geona-time-panel-container').width();
  }

  /**
   * Updates the dataHeight and fullHeight variables to keep the correct proportions for the window size.
   */
  calculateHeights() {
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
    console.log('zoom');
    console.log(d3.event.transform.rescaleX);

    this.timelineLayerBars.attr('transform', d3.event.transform);
    // this.zooming = true;
    let newXScale = d3.event.transform.rescaleX(this.xScale);
    // console.log(newXScale.domain());
    // let 
    this.xScale.domain(d3.event.transform.rescaleX(this.xScale2).domain());
    // this.
    // this.xScale = newXScale; // Update the xScale to match the newly created x scale
    this.timelineXAxisGroup.call(this.xAxis.scale(newXScale));

    console.log(this.xScale(Date.parse('2010-01-01')));

    // this.timelineLayers.selectAll('.geona-timeline-layer').attr('transform', (layer) => {
    //   let transformX = d3.event.transform.rescaleX(this.xScale);
    //   return 'translate(' + transformX(Date.parse(layer.allDates[0])) + ')';
    // });

    // this.redrawLayers();
  }

  /**
   * Redraws the layers on the timeline based on the current x and y axes.
   */
  redrawLayers() {
    console.log('redrawing layers');
    // Deep copy the currently active layers
    let currentLayers = [];
    for (let currentLayer of this.timelineCurrentLayers) {
      currentLayers.push(currentLayer);
    }

    // Delete the current elements for the currently active layers
    this.timelineLayers.selectAll('.geona-timeline-layer')
      .remove().exit();

    // Reset the timeline current layers to an empty array
    this.timelineCurrentLayers.length = 0;

    // Add the layers back again - the elements will calculate their size values based on the current axes
    for (let currentLayer of currentLayers) {
      this.addTimelineLayer(currentLayer);
    }
  }

  /**
   * I think we'll need this for when the window resizes, and we need to update tick sizes etc.
   */
  redrawSvg() {

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
