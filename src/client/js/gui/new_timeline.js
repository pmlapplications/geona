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

    this.timelineCurrentLayers = [];
    this.startDate = undefined;
    this.endDate = undefined;

    this.dataWidth = undefined; // Calculated in calculateWidths() // TODO jsdoc these
    this.fullWidth = undefined; // Calculated in calculateWidths()
    this.calculateWidths();
    this.dataHeight = undefined; // Calculated in calculateHeights() // TODO jsdoc these
    this.fullHeight = undefined; // Calculated in calculateHeights()
    this.calculateHeights();

    // Set the scale for the xAxis to use
    this.xScale = d3.scaleTime()
      .domain([
        new Date(new Date('2010-01-01')),
        new Date(new Date('2011-01-01')),
      ])
      .range([this.Y_AXIS_LABEL_WIDTH, this.dataWidth]); // FIXME dataWidth is 1px short of showing the full axis

    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(Math.round(this.dataWidth / 77)); // Width-based calculation // TODO write a wiki entry explaining decisions like this

    this.yScale = d3.scaleBand() // Domain is not set because it will update as layers are added
      .range([0, this.dataHeight])
      .paddingInner(this.LAYER_PADDING);

    this.yAxis = d3.axisLeft(this.yScale)
      .ticks(this.timelineCurrentLayers.length);

    // Selects the main element to insert the timeline elements into
    this.timeline = d3.select('#' + this.options.elementId)
      .append('svg')
      .attr('width', this.dataWidth)
      .attr('height', this.dataHeight);

    // Add a group and draw the x axis
    this.timeline.append('g')
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
    // this.addTimelineLayer(this.options.layers[0]);
    // this.addTimelineLayer(this.options.layers[1]);
    // this.addTimelineLayer(this.options.layers[2]);
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

    // TODO
    // Update xScale domain to show first layer's full extent
    this.xScale.domain([new Date('1996-01-01'), new Date('2018-01-01')]);
    // Update yScale range and domain
    this.yScale.range([0, this.dataHeight])
      .domain(this.timelineCurrentLayers.map((layer) => {
        return layer.title;
      }));


    // Create a g for each layer
    this.timelineLayerBars = this.timelineLayers.selectAll('.geona-timeline-layer')
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
      .attr('y', this.yScale(0)) // Alignment is relative to the group, so 0 always refers to the top position of the group.
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
      this.addTimeStepMarkers(layer, layer.allDates);
    }
  }

  /**
   * Adds the time step marker elements for the specified layer.
   * @param {Object} layer    The definition for the layer we are using.
   * @param {Array}  allDates The collection of dates to insert markers for.
   */
  addTimeStepMarkers(layer, allDates) {
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

  draw() {

  }
}
