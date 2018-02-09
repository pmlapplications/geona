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
            '1997-01-01',
            '2002-01-01',
            '2010-01-01',
            '2015-01-01',
          ],
        },
        {
          identifier: 'chlor_b',
          title: 'chlor b title',
          startDate: '1997-01-01',
          endDate: '2012-01-01',
          allDates: [
            '1997-01-01',
            '2002-01-01',
            '2010-01-01',
            '2015-01-01',
          ],
        },
        {
          identifier: 'chlor_c',
          title: 'chlor c title',
          startDate: '1997-01-01',
          endDate: '2014-01-01',
          allDates: [
            '1997-01-01',
            '2002-01-01',
            '2010-01-01',
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
      .range([this.Y_AXIS_LABEL_WIDTH, this.dataWidth]);

    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(Math.round(this.dataWidth / 77)); // Width-based calculation // TODO write a wiki entry explaining decisions like this

    this.yScale = d3.scaleBand()
      .range([0, this.dataHeight])
      .domain(this.options.layers.map((layer) => {
        return layer.title;
      }))
      .paddingInner(0.3); // 30% of height, i.e. 3px

    this.yAxis = d3.axisLeft(this.yScale)
      .ticks(this.options.layers.length);

    // Selects the main element to insert the timeline elements into
    this.timeline = d3.select('#' + this.options.elementId)
      .append('svg')
      .attr('width', this.dataWidth)
      .attr('height', this.dataHeight);

    // Add a group and draw the axis
    this.timeline.append('g')
      .attr('class', 'geona-timeline-x-axis')
      .attr('transform', 'translate(' + (this.Y_AXIS_LABEL_WIDTH) + ', ' + (this.fullHeight - this.X_AXIS_LABEL_HEIGHT) + ')')
      .call(this.xAxis);
    this.timeline.append('g')
      .attr('class', 'geona-timeline-y-axis')
      .attr('transform', 'translate(' + this.Y_AXIS_LABEL_WIDTH + ')')
      .call(this.yAxis);

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

    this.timelineLayerBars = this.timeline.selectAll('rect')
      .remove()
      .exit()
      .data(this.timelineLayers); // Bind each layer to a rect (rects not yet created)

    this.timelineLayerBars.enter().append('rect')
      .attr('x', (layer) => {
        return this.xScale(Date.parse(layer.startDate));
      })
      .attr('y', (layer) => {
        return this.yScale(layer.title);
      })
      .attr('height', 10)
      .attr('width', (layer) => {
        return this.xScale(Date.parse(layer.endDate));
      })
      .attr('fill', '#666666')
      .attr('shape-rendering', 'crispEdges');

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
