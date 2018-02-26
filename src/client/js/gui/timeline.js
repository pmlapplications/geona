import 'jquery';
import * as d3 from 'd3';

import {registerTriggers} from './timeline_triggers';
import {registerBindings} from './timeline_bindings';

/**
 *
 */
export class Timeline {
  // TODO transfer all css (e.g. colours) into other file
  /**
   * 
   * @param {*} timePanel 
   * @param {*} settings 
   */
  constructor(timePanel, settings) {
    this.timePanel = timePanel;
    this.parentDiv = timePanel.parentDiv;
    this.eventManager = timePanel.geona.eventManager;

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
    /** @type {Number} CONST - The pixel height needed to make room for the x-axis */
    this.X_AXIS_LABEL_HEIGHT = 25;
    /** @type {Number} CONST - The pixel width needed to make room for the y-axis */
    this.Y_AXIS_LABEL_WIDTH = 138;

    /** @type {Array} The currently active layer definitions shown on the timeline */
    this.timelineCurrentLayers = [];

    this.startDate = undefined;
    this.endDate = undefined;

    /** The width of the whole svg element created for the timeline */
    this.fullWidth = undefined;
    /** The width of only the section of the svg which contains the layers */
    this.dataWidth = undefined; // FIXME dataWidth cuts off the axis + labels
    /** The height of the whole svg element created for the timeline */
    this.fullHeight = undefined;
    /** The height of only the section of the svg which contains the layers */
    this.dataHeight = undefined;

    this._calculateWidths();
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
    this.xScale2 = d3.scaleTime() // TODO is there any alternative to this? Maybe just make it in the zoom bit? But how would it update?
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

    this.yAxis = d3.axisRight(this.yScale)
      .ticks(this.timelineCurrentLayers.length)
      .tickSize(0);

    let zoom = d3.zoom()
      .scaleExtent([0, Infinity])
      .translateExtent([[this.xScale(Date.parse('1500-01-01')), 0], [Infinity, this.dataHeight]]) // TODO does this do anything, especially 1500-01-01
      .on('zoom', () => { // Uses arrow function to prevent 'this' context changing within zoom()
        this.zoom();
      });

    this.layerDateExtent = { // Set to the domain for default
      min: this.xScale.domain()[0], // TODO make everything either a string or a date in storage
      max: this.xScale.domain()[1],
    };

    // Selects the main element to insert the timeline elements into
    this.timeline = d3.select('#' + this.options.elementId)
      .append('svg')
      .attr('width', this.dataWidth)
      .attr('height', this.dataHeight)
      .call(zoom)
      .on('click', () => { // Uses arrow function to prevent 'this' context changing within clickDate()
        this.clickDate(this.timeline.node());
      });

    // Add a group and draw the x axis
    this.timelineXAxisGroup = this.timeline.append('g')
      .attr('class', 'geona-timeline-x-axis')
      .attr('transform', 'translate(' + (this.Y_AXIS_LABEL_WIDTH) + ', ' + (this.fullHeight - this.X_AXIS_LABEL_HEIGHT) + ')')
      .call(this.xAxis);
    // Add a group and draw the y axis
    this.timelineYAxisGroup = this.timeline.append('g')
      .attr('class', 'geona-timeline-y-axis')
      .call(this.yAxis);
    this.timelineYAxisGroup.select('path.domain')
      .style('display', 'none');
    // Add a group for the layer bars
    this.timelineLayers = this.timeline.append('g')
      .attr('class', 'geona-timeline-layers');

    this.selectorDate = '2010-06-01';

    this.selectorTool = this.timelineLayers.append('rect')
      .attr('cursor', 'e-resize')
      .attr('class', 'geona-timeline-selector-tool')
      .attr('x', () => {
        return this.xScale(new Date(this.selectorDate));
      })
      .attr('y', 2) // todo Make const
      .attr('width', 10) // todo Make const
      .attr('height', this.dataHeight)
      .attr('rx', 6) // todo Make const
      .attr('ry', 6) // todo Make const
      .call(
        d3.drag()
          .on('drag', () => {
            this.dragDate();
          })
          .on('end', () => {
            this.triggerMapDateChange(this.selectorDate);
          })
      );

    // // Add the currently active layers
    // for (let layer of this.options.layers) {
    //   this.addTimelineLayer(layer);
    // }

    // Set triggers and bindings
    registerTriggers();
    registerBindings(this.eventManager, this.timePanel);
  }

  /**
   * Adds the specified layer to the timeline
   * @param {Object} layerToAdd
   */
  addTimelineLayer(layerToAdd) {
    // Increase timeline height to accommodate one new layer
    this.timelineCurrentLayers.push(layerToAdd);
    this._calculateHeights();
    this.updateLayerDateExtent();

    // Update xScale domain to show first layer's full extent
    if (this.timelineCurrentLayers.length === 1) {
      let allDates = layerToAdd.dimensions.time.values;
      if (allDates.length > 1) {
        this.xScale.domain([
          Date.parse(allDates[0]),
          Date.parse(allDates[allDates.length - 1]),
        ]);
        this.xScale2.domain([
          Date.parse(allDates[0]),
          Date.parse(allDates[allDates.length - 1]),
        ]);
      }
      if (layerToAdd.dimensions.time.default) {
        this.selectorDate = layerToAdd.dimensions.time.default;
      }
    }
    // Update yScale range and domain
    this.yScale.range([0, this.dataHeight])
      .domain(this.timelineCurrentLayers.map((layer) => {
        // FIXME select correct language
        return layer.title.und;
      }));

    this.timelineLayerSelection = this.timelineLayers.selectAll('.geona-timeline-layer');
    // Create a g for each layer
    this.timelineLayerBars = this.timelineLayerSelection
      .remove().exit()
      .data(this.timelineCurrentLayers)
      .enter().append('g')
      .attr('class', 'geona-timeline-layer')
      .attr('data-layer-identifier', (layer) => { // Adds the identifier as a data attribute
        return layer.identifier;
      })
      .attr('transform', (layer) => {
        // FIXME select correct title language
        return 'translate(0, ' + this.yScale(layer.title.und) + ')';
      })

      // Within the g create a rect
      .append('rect')
      .attr('x', (layer) => {
        let allDates = layer.dimensions.time.values;
        return this.xScale(Date.parse(allDates[0]));
      })
      .attr('y', 0) // Alignment is relative to the group, so 0 always refers to the top position of the group.
      .attr('height', this.LAYER_HEIGHT)
      .attr('width', (layer) => {
        let allDates = layer.dimensions.time.values;
        let startDateXPosition = this.xScale(Date.parse(allDates[0]));
        let endDateXPosition = this.xScale(Date.parse(allDates[allDates.length - 1]));
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
      .call(this.yAxis)
      .raise();

    // Trim the visible title to prevent overspill onto the layer bars
    this.timelineYAxisGroup.selectAll('text')
      .call((yAxisLabels) => {
        for (let textElement of yAxisLabels.nodes()) {
          if (textElement.getComputedTextLength() > this.Y_AXIS_LABEL_WIDTH) {
            // Gives us the percentage of text which is contained within the label area
            let trimProportion = this.Y_AXIS_LABEL_WIDTH / textElement.getComputedTextLength();
            // Gives us the number of characters we can fit into the label area from the full title
            let trimLength = Math.floor(textElement.innerHTML.length * trimProportion) - 3; // - 3 makes space for '...'
            // Gives us the trimmed title, with ellipsis at end to indicate cutoff
            let trimmedLabel = textElement.innerHTML.slice(0, trimLength) + '...';

            textElement.innerHTML = trimmedLabel;
          }
        }
      })
      .on('mouseover', (label) => {
        // TODO display full label (parameter) in popup bubble (the popup might interfere with panning the layerbars)
        console.log(label);
      });

    // Adjust the height of the selector tool for the new dataHeight and reorder to be in front of the new layer
    this.timelineLayers.select('.geona-timeline-selector-tool')
      .attr('height', this.dataHeight)
      .attr('x', () => { // Change x position in case domain has changed
        return this.xScale(new Date(this.selectorDate));
      })
      .raise();

    for (let layer of this.timelineCurrentLayers) {
      this._addTimeStepMarkers(layer, layer.dimensions.time.values);
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
    this.timelineLayers.select('[data-layer-identifier = ' + layer.identifier + ']').selectAll('line')
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
   * Removes the layer with the specified identifier from the timeline.
   * @param {String} layerIdentifier The identifier for the layer to remove.
   */
  removeTimelineLayer(layerIdentifier) {
    // Remove the element from the SVG
    this.timelineLayers.select('[data-layer-identifier = ' + layerIdentifier + ']')
      .remove().exit();

    // Remove the layer from the current layers array
    let layerToRemove = this._findActiveLayerDefinition(layerIdentifier);
    let layerIndex = this.timelineCurrentLayers.indexOf(layerToRemove);
    this.timelineCurrentLayers.splice(layerIndex, 1);

    this._calculateHeights();
    this.updateLayerDateExtent();

    // Update yScale range and domain
    this.yScale.range([0, this.dataHeight])
      .domain(this.timelineCurrentLayers.map((layer) => {
        // FIXME select correct language
        return layer.title.und;
      }));

    this.timeline.attr('height', this.fullHeight); // Decrease the height of the SVG element
    this.timeline.select('.geona-timeline-x-axis')
      .attr('transform', 'translate(0, ' + (this.fullHeight - this.X_AXIS_LABEL_HEIGHT) + ')');
    this.timeline.select('.geona-timeline-x-axis')
      .call(this.xAxis);
    this.timeline.select('.geona-timeline-y-axis')
      .call(this.yAxis)
      .raise();

    // Adjust the height of the selector tool for the new dataHeight and reorder to be in front of the new layer
    this.timelineLayers.select('.geona-timeline-selector-tool')
      .attr('height', this.dataHeight)
      .attr('x', () => { // Change x position in case domain has changed
        return this.xScale(new Date(this.selectorDate));
      })
      .raise();
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
        let allDates = layer.dimensions.time.values;
        let startDate = allDates[0];
        return this.xScale(Date.parse(startDate));
      })
      .attr('width', (layer) => {
        let allDates = layer.dimensions.time.values;
        let startDate = allDates[0];
        let endDate = allDates[allDates.length - 1];
        return this.xScale(Date.parse(endDate)) - this.xScale(Date.parse(startDate));
      });

    // TODO make it only redraw if the zoom level changed, rather than if it was purely a pan
    // Remove the time markers - we need to redraw completely in case of pixel overlap (more info on wiki)
    this.timelineLayers.selectAll('.geona-timeline-layer-time-marker')
      .remove().exit();
    // Add time markers back
    for (let layer of this.timelineCurrentLayers) {
      this._addTimeStepMarkers(layer, layer.dimensions.time.values);
    }

    // Adjust positioning of the selector tool
    this.timelineLayers.select('.geona-timeline-selector-tool')
      .attr('x', () => {
        return this.xScale(new Date(this.selectorDate));
      });
  }

  /**
   * 
   * @param {HTMLElement} container 
   */
  clickDate(container) {
    let clickXPosition = d3.mouse(container)[0];
    this.selectorDate = this.xScale.invert(clickXPosition);
    this.triggerMapDateChange(this.selectorDate);
    this._moveSelectorToDate(this.selectorDate);
  }

  /**
   * Sets the layerDateExtent to the minimum and maximum dates of all timeline layers.
   */
  updateLayerDateExtent() {
    for (let layer of this.timelineCurrentLayers) {
      let allDates = layer.dimensions.time.values;
      if (new Date(allDates[0]) < this.layerDateExtent.min) {
        this.layerDateExtent.min = new Date(allDates[0]);
      }
      if (new Date(allDates[allDates.length - 1]) > this.layerDateExtent.max) {
        this.layerDateExtent.max = new Date(allDates[allDates.length - 1]);
      }
    }
  }

  /**
   * Sets the timeline date to the specified date. If date is outside the layerDateExtent then it will be capped at the
   * layerDateExtent min or max.
   * @param {String|Date} date 
   */
  triggerMapDateChange(date) {
    let validDate = date;
    if (date < this.layerDateExtent.min) {
      validDate = this.layerDateExtent.min;
    } else if (date > this.layerDateExtent.max) {
      validDate = this.layerDateExtent.max;
    }
    console.log(new Date(validDate));
    // TODO is trigger in correct way?
    this.eventManager.trigger('timePanel.timelineChangeTime', new Date(validDate));
  }

  /**
   * Moves the selector tool to the date position on the x-axis.
   * @param {String} date The date to move the selector tool to.
   */
  _moveSelectorToDate(date) {
    this.selectorDate = date;
    if (date < this.layerDateExtent.min) {
      this.selectorDate = this.layerDateExtent.min;
    } else if (date > this.layerDateExtent.max) {
      this.selectorDate = this.layerDateExtent.max;
    }
    // TODO add this.options.animateSelector option (from GISPortal)
    this.timelineLayers.select('.geona-timeline-selector-tool')
      .transition().duration(500).attr('x', () => {
        return this.xScale(new Date(this.selectorDate));
      });
  }

  /**
   * 
   */
  dragDate() {
    let dragXPosition = this.xScale(new Date(this.selectorDate)) + d3.event.dx;
    let dragXDate = this.xScale.invert(dragXPosition);
    if (dragXDate < this.layerDateExtent.min) {
      dragXDate = this.layerDateExtent.min;
    } else if (dragXDate > this.layerDateExtent.max) {
      dragXDate = this.layerDateExtent.max;
    }

    this.selectorDate = new Date(dragXDate);

    this.selectorTool.attr('x', () => {
      return this.xScale(new Date(this.selectorDate));
    });

    // TODO update current date box as we drag
  }

  /**
   * @private
   *
   * Returns the layer in this.timelineCurrentLayers with the specified identifier, or undefined if not found.
   * @param {String} layerIdentifier The identifier for the currentLayer.
   * @return {Object|undefined} A layer from this.timelineCurrentLayers
   */
  _findActiveLayerDefinition(layerIdentifier) {
    for (let layer of this.timelineCurrentLayers) {
      if (layer.identifier === layerIdentifier) {
        return layer;
      }
    }
    return undefined;
  }
}

/**
 * Selects the appropriate date format depending on the precision of the date.
 * @param {*} date String/Date?
 * @return {d3.timeFormat} The time format to use on the timeline
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
