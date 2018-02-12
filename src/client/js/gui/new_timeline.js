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
          startDate: '1997-01-01',
          endDate: '2015-01-01',
          allDates: [
            '1998-01-01',
            '2001-01-01',
            '2011-01-01',
            '2015-01-01',
          ],
        },
        {
          identifier: 'chlor_b',
          title: 'chlor b title',
          startDate: '1997-01-01',
          endDate: '2012-01-01',
          allDates: [
            '1998-01-01',
            '2002-01-01',
            '2012-01-01',
            '2015-01-01',
          ],
        },
        {
          identifier: 'chlor_c',
          title: 'chlor c title',
          startDate: '1997-01-01',
          endDate: '2014-01-01',
          allDates: [
            '1998-01-01',
            '2003-01-01',
            '2013-01-01',
            '2015-01-01',
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

    this.timelineLayers = [];

    this.dataWidth = undefined;
    this.fullWidth = undefined;
    this.calculateWidths();
    this.dataHeight = undefined; // Calculated in calculateHeights() // TODO jsdoc these
    this.fullHeight = undefined; // Calculated in calculateHeights()
    this.calculateHeights();

    // Set the scale for the xAxis to use
    this.xScale = d3.scaleTime()
      .domain([
        new Date(Date.parse(this.options.layers[0].startDate)),
        new Date(Date.parse(this.options.layers[0].endDate)),
      ])
      .range([this.Y_AXIS_LABEL_WIDTH, this.dataWidth]); // TODO dataWidth is 1px short of showing the full axis

    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(Math.round(this.dataWidth / 77)); // Width-based calculation // TODO write a wiki entry explaining decisions like this

    this.yScale = d3.scaleBand()
      .range([0, this.dataHeight])
      .domain(this.options.layers.map((layer) => {
        return layer.title;
      }))
      .paddingInner(this.LAYER_PADDING);

    this.yAxis = d3.axisLeft(this.yScale)
      .ticks(this.options.layers.length);

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
    this.timelineLayerBars = this.timeline.append('g')
      .attr('class', 'geona-timeline-layer-bars');

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
    this.timelineLayers.push(layerToAdd);
    this.calculateHeights();
    // Update yScale range and domain
    this.yScale.range([0, this.dataHeight])
      .domain(this.options.layers.map((layer) => {
        return layer.title;
      }));

    // Create a g for each layer
    // Within the g create a rect
    // Within the g create x markers

    let layerBar = this.timelineLayerBars.selectAll('.geona-timeline-layer-bar')
      .remove().exit()
      .data(this.timelineLayers)
      .enter().append('g')
      .attr('class', 'geona-timeline-layer-bar')
      .attr('transform', (layer) => {
        return 'translate(' + this.yScale(layer.title) + ')';
      });

      // Add a rect for each layer
    layerBar.selectAll('rect')
      .data(this.timelineLayers)
      .enter().append('rect')
      .attr('x', (layer) => {
        return this.xScale(Date.parse(layer.startDate));
      })
      .attr('y', (layer) => {
        return this.yScale(layer.title);
      })
      .attr('height', this.LAYER_HEIGHT)
      .attr('width', (layer) => {
        return this.xScale(Date.parse(layer.endDate));
      })
      .attr('fill', '#b1a7bc')
      .attr('shape-rendering', 'crispEdges')
      .attr('class', 'geona-timeline-layer-bar');

    layerBar.selectAll('line')
      .data(this.timelineLayers)
      .enter().append('line')
      .attr('x1', (layer, index) => {
        return this.xScale(Date.parse(layer.allDates[index])).toString();
      })
      .attr('x2', (layer, index) => {
        return this.xScale(Date.parse(layer.allDates[index])).toString();
      })
      .attr('y1', (layer, index) => {
        return this.yScale(layer.title).toString();
      })
      .attr('y2', (layer, index) => {
        return (this.yScale(layer.title) + this.LAYER_HEIGHT).toString();
      })
      .attr('stroke', '#000000')
      .attr('stroke-width', '1')
      .attr('shape-rendering', 'crispEdges')
      .attr('class', 'geona-timeline-layer-time-marker');

    this.timeline.attr('height', this.fullHeight); // Increase the height of the SVG element so we can view all layers
    this.timeline.select('.geona-timeline-x-axis')
      .attr('transform', 'translate(0, ' + (this.fullHeight - this.X_AXIS_LABEL_HEIGHT) + ')');
    this.timeline.select('.geona-timeline-y-axis')
      .call(this.yAxis);
  }

  calculateWidths() {
    this.dataWidth = this.parentDiv.find('.js-geona-time-panel-container').width() -
      this.options.timelineMargins.left - this.options.timelineMargins.right -
      this.Y_AXIS_LABEL_WIDTH;
    this.fullWidth = this.parentDiv.find('.js-geona-time-panel-container').width();
  }

  calculateHeights() {
    this.dataHeight = this.LAYER_HEIGHT * this.timelineLayers.length;
    this.fullHeight = this.dataHeight +
      this.options.timelineMargins.top + this.options.timelineMargins.bottom +
      this.X_AXIS_LABEL_HEIGHT;
  }

  draw() {

  }
}
