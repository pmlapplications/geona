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

    this.LAYER_HEIGHT = 10;
    this.X_AXIS_LABEL_HEIGHT = 25;


    this.width = this.parentDiv.find('.js-geona-time-panel-container').width();
    this.dataHeight = undefined; // Initial height of 25 is the height needed for the axis + axis labels

    // Set the scale for the xAxis to use
    this.xScale = d3.scaleTime()
      .domain([
        new Date(Date.parse(this.options.layers[0].startDate)),
        new Date(Date.parse(this.options.layers[0].endDate)),
      ])
      .range([0, this.width]);

    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(4); // TODO set using calculation based on width

    this.yScale = d3.scaleBand()
      .range([0, this.height])
      .domain(this.options.layers.map((layer) => {
        return layer.identifier;
      }))
      .paddingInner(0.2); // 20% of height, i.e. 2px

    this.yAxis = d3.axisLeft(this.yScale).ticks(this.options.layers.length);

    // Selects the main element to insert the timeline elements into
    this.timeline = d3.select('#' + this.options.elementId)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // Add a group and draw the axis
    this.timeline.append('g')
      .attr('class', 'geona-timeline-x-axis')
      .attr('transform', 'translate(0, ' + (this.height - 25) + ')')
      .call(this.xAxis);
    this.timeline.append('g')
      .attr('class', 'geona-timeline-y-axis')
      // .attr('transform', 'translate(0, ' + (this.height - 25) + ')')
      .call(this.yAxis);

    this.layers = this.timeline.selectAll('rect')
      .data(this.options.layers); // Bind each layer to a rect (rects not yet created)

    this.height += 10;
    this.yScale.range([0, this.height]);

    this.layers.enter().append('rect')
      .attr('x', (layer) => {
        return this.xScale(Date.parse(layer.startDate));
      })
      .attr('y', (layer) => {
        console.log(layer);
        console.log(this.yScale(layer));
        return this.yScale(layer.identifier);
      })
      .attr('height', 10)
      .attr('width', (layer) => {
        return this.xScale(Date.parse(layer.endDate));
      })
      .attr('fill', '#666666');

    this.timeline.select('svg')
      .attr('height', this.height);
  }

  addTimelineLayer(layer) {
    // Increase timeline height to accommodate one new layer

    // Update yScale range and domain
  }

  calculateHeights() {
    if (this.options.layers.length > 0) {
      this.dataHeight = this.LAYER_HEIGHT * this.options.layers.length;
    } else {
      this.dataHeight = this.X_AXIS_LABEL_HEIGHT; // TODO could be misleading - probably just set to 0.
    }
    this.fullHeight = this.dataHeight +
      this.options.timelineMargins.top + this.options.timelineMargins.bottom +
      this.X_AXIS_LABEL_HEIGHT;
  }
}
