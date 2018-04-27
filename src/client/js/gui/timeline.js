/** @module timeline */

import 'jquery';
import * as d3 from 'd3';
import tippy from 'tippy.js';

import {selectPropertyLanguage, findNearestValidTime} from '../map_common';

// import {registerTriggers} from './timeline_triggers';
import {registerBindings} from './timeline_bindings';

/**
 * An SVG timeline, built using D3 version 4.
 * Used to select times for layers on the map.
 *
 * The Timeline can be controlled in a variety of ways:
 * - Clicking on a bar will move the selector to that position, and load the closest previous time.
 * - Clicking on an x-axis label will move the selector to the label date and load the closest previous time.
 * - The method moveSelectorToDate() can be called programmatically to change the location of the selector tool.
 *     Note that this does not actually affect the map layers, which are controlled with their map library methods.
 * - The method setView() can be called programmatically to set the pan and zoom.
 * - The timeline can be scrolled on in order to adjust the zoom level.
 * - The timeline can be dragged in order to pan forwards and backwards along the x-axis.
 *
 * There are also controls in the TimePanel for:
 * - Buttons to move a set number of intervals forwards and backwards in time.
 * - A Pikaday date picker to jump to a specific datetime.
 * - Keydown listeners to trigger the command to move a set number of intervals forwards and backwards in time.
 */
export class Timeline {
  // TODO redraw on window resize is bugged (see Geona issue 97)
  // https://gitlab.rsg.pml.ac.uk/web-development/geona/issues/97

  // New feature suggestion - on hover, tooltip of time which will be loaded? e.g. get the nearestPreviousTime and show in a tooltip
  // New feature suggestion - should layers reorder if layers are reordered on GUI?
  // New feature suggestion - timeline rects that draw from the selector tool back to the time marker for the current time on each layer to show which time is currently shown
  // New feature suggestion - active layer can be selected, so controls consider only that layer (GUI should update to show which layer is the current layer)
  // New feature suggestion - extended keyboard shortcuts (select time period, select active layer)
  /**
   * Initialise the Timeline's class variables and some SVG elements, such as the axes, without displaying any data.
   *
   * @param {TimePanel} timePanel An instance of a TimePanel which the Timeline will be displayed within.
   * @param {Object}    settings  A collection of settings which affect the Timeline.
   *   @param {String}  settings.elementId           The id of the element into which the Timeline will be inserted.
   *   @param {Object}  [settings.timelineMargins]   The margins in px (top, left, right, bottom) around the timeline.
   *   @param {Boolean} [settings.animateSelector]   If True, the selector tool will animate between positions.
   *   @param {Object}  [settings.paddingPercentage] The % to pad when setting the view or showing the first layer.
   */
  constructor(timePanel, settings) {
    window.d3 = d3;
    this.timePanel = timePanel;
    this.geonaDiv = timePanel.geonaDiv;
    this.geona = timePanel.geona;
    this.eventManager = timePanel.geona.eventManager;

    // Default options will be merged with the settings parameter
    let defaultOptions = {
      animateSelector: true,
      paddingPercentage: {
        left: 10,
        right: 10,
      },
      keydownListenerEnabled: true,
      timelineMargins: {
        top: 5,
        left: 0,
        right: 200,
        bottom: 0,
      },
    };
    /** @type {Object} @desc Default options with custom settings if defined */
    this.options = Object.assign({}, defaultOptions, settings);

    /** @type {Number} @desc CONST - The pixel height for a layer on the timeline */
    this.LAYER_HEIGHT = 10;
    /** @type {Number} @desc CONST - The pixel height for the padding between layers */
    this.LAYER_PADDING = 0.25;
    /** @type {Number} @desc CONST - The pixel height needed to make room for the x-axis */
    this.X_AXIS_LABEL_HEIGHT = 25;
    /** @type {Number} @desc CONST - The pixel spacing between the layers and the x-axis */
    this.X_AXIS_SEPARATION = 5;
    /** @type {Number} @desc CONST - The pixel width needed to make room for the y-axis */
    this.Y_AXIS_LABEL_WIDTH = 138;
    /** @type {Number} @desc CONST - The vertical positioning of the selector tool */
    this.SELECTOR_TOOL_Y = 1;
    /** @type {Number} @desc CONST - The width of the selector tool */
    this.SELECTOR_TOOL_WIDTH = 10;
    /** @type {Number} @desc CONST - The x-axis radius of the ellipse used to round the edges of the selector tool */
    this.SELECTOR_TOOL_RX = 6;
    /** @type {Number} @desc CONST - The y-axis radius of the ellipse used to round the edges of the selector tool */
    this.SELECTOR_TOOL_RY = 6;
    /** @type {Number} @desc CONST - The correction on the x-axis needed to center the selector tool */
    this.SELECTOR_TOOL_CORRECTION = this.SELECTOR_TOOL_WIDTH / 2;
    /** @type {Number} @desc CONST - The amount of pixels off the edge of the timeline before markers are not drawn */
    this.TIME_MARKER_DRAW_MARGIN = 5;
    /** @type {Number} @desc CONST - The time in ms to add to each side if the first timeline layer only has a single time*/
    this.SINGLE_TIME_EXTENT_MARGIN = 15638400000; // 6 months in ms

    /** @type {Array} @desc The currently active layer definitions shown on the timeline */
    this.timelineCurrentLayers = [];

    /** @type {Number} @desc The width of the whole svg element created for the timeline */
    this.fullWidth = undefined;
    /** @type {Number} @desc The width of only the section of the svg which contains the layers */
    this.dataWidth = undefined;
    /** @type {Number} @desc The height of the whole svg element created for the timeline */
    this.fullHeight = undefined;
    /** @type {Number} @desc The height of only the section of the svg which contains the layers */
    this.dataHeight = undefined;

    /** @type {Number} @desc The minimum spacing ratio between x-axis labels */
    this.xAxisTicks = undefined; // More information can be found on the Geona wiki

    this._calculateWidths();
    this._calculateHeights();

    /** @type {d3.scaleTime} @desc The scale to use for the x-axis - translates px to date */
    this.xScale = d3.scaleTime()
      .range([this.Y_AXIS_LABEL_WIDTH, this.fullWidth])
      .domain([
        new Date('2010-01-01'),
        new Date('2011-01-01'),
      ]);
    this.xScale2 = d3.scaleTime()
      .range([this.Y_AXIS_LABEL_WIDTH, this.fullWidth])
      .domain([
        new Date('2010-01-01'),
        new Date('2011-01-01'),
      ]);

    /** @type {d3.axisBottom} @desc The x-axis which is displayed underneath the timeline data */
    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(this.xAxisTicks)
      .tickFormat(getDateFormat);


    /** @type {d3.scaleBand} @desc The scale to use for the y-axis - translates px to layer title/display name */
    this.yScale = d3.scaleBand() // Domain is not set because it will update as layers are added and removed
      .range([0, this.dataHeight])
      .paddingInner(this.LAYER_PADDING);

    /** @type {d3.axisBottom} @desc The y-axis which is displayed to the left of the timeline data */
    this.yAxis = d3.axisRight(this.yScale)
      .ticks(this.timelineCurrentLayers.length)
      .tickSize(0);

    /** @type {Object} @desc The full labels for the current layers - used so we don't get display name, server again */
    this.yAxisFullLabels = {};


    /** @type {Object} @desc The minimum and maximum dates after checking every layer on the timeline */
    this.layerDateExtent = { // Set to the domain for default
      min: this.xScale.domain()[0],
      max: this.xScale.domain()[1],
    };


    /** @type {d3.zoom} @desc The zoom behaviour to be used for panning and zooming the timeline data */
    this.zoomBehavior = d3.zoom()
      .on('zoom', () => { // Uses arrow function to prevent 'this' context changing within zoom()
        this.zoom();
      });

    /** @type {SVGElement} @desc The main SVG element used for the timeline */
    this.timeline = d3.select('#' + this.options.elementId) // Selects the main element to insert the timeline into
      .append('svg')
      .attr('width', this.fullWidth + 1) // +1 because the containing svg needs to be 1 px longer than inner elements
      .attr('height', this.fullHeight)
      .attr('transform', 'translate(' +
        this.options.timelineMargins.left + ', ' +
        this.options.timelineMargins.top +
        ')')
      .call(this.zoomBehavior)
      .on('click', () => { // Uses arrow function to prevent 'this' context changing within clickDate()
        this.clickDate(this.timeline.node());
      });


    /** @type {SVGElement} @desc The SVG g element which holds the x-axis elements */
    this.timelineXAxisGroup = this.timeline.append('g')
      .attr('class', 'geona-timeline-x-axis')
      .attr('transform', 'translate(' +
        (this.Y_AXIS_LABEL_WIDTH) + ', ' +
        (this.dataHeight + this.X_AXIS_SEPARATION - this.options.timelineMargins.bottom) +
        ')')
      .call(this.xAxis);
    this.timelineXAxisGroup.selectAll('.tick') // Set clickable axis labels
      .on('click', (dateLabel) => {
        d3.event.stopPropagation(); // Stops the click event on this.timeline from also firing
        this.selectorDate = dateLabel;
        this.triggerMapDateChange(this.selectorDate);
        this.moveSelectorToDate(this.selectorDate);
      });


    /** @type {SVGElement} @desc The SVG g element which holds the y-axis elements */
    this.timelineYAxisGroup = this.timeline.append('g')
      .call(this.yAxis)
      .on('click', () => { // Prevents the click functions from being triggered when y-axis is clicked
        d3.event.stopPropagation();
      });
    this.timelineYAxisGroup // Adds plain background to go behind labels
      .append('rect')
      .attr('class', 'js-geona-timeline-y-axis-background geona-timeline-y-axis-background')
      .attr('width', this.Y_AXIS_LABEL_WIDTH)
      .attr('height', this.fullHeight);


    /** @type {SVGElement} @desc The SVG g element which holds the timeline data (layers) */
    this.timelineData = this.timeline.append('g');


    /** @type {d3.drag} @desc The drag behaviour to be used for dragging the selector tool */
    let drag = d3.drag()
      .on('drag', () => {
        this.dragDate();
      })
      .on('end', () => {
        this.triggerMapDateChange(this.selectorDate);
      });

    /** @type {String} @desc The date that the selector tool should be set to */
    this.selectorDate = '2010-06-01';

    /** @type {SVGElement} @desc The SVG rect element which moves to show the currently selected date */
    this.selectorTool = this.timelineData.append('rect')
      .attr('class', 'geona-timeline-selector-tool')
      .attr('x', () => {
        return this.xScale(new Date(this.selectorDate)) - this.SELECTOR_TOOL_CORRECTION;
      })
      .attr('y', this.SELECTOR_TOOL_Y)
      .attr('width', this.SELECTOR_TOOL_WIDTH)
      .attr('height', this.dataHeight)
      .attr('rx', this.SELECTOR_TOOL_RX)
      .attr('ry', this.SELECTOR_TOOL_RY)
      .call(drag);


    /** @type {SVGElement} @desc The SVG line element which marks today's date */
    this.todayLine = this.timelineData
      .append('line')
      .attr('class', 'geona-timeline-today-line')
      .attr('y1', 0); // y2, x1, x2 are set when the first layer is added

    /** @type {Date} @desc Today's date - only changes on page reload */
    this.todayDate = new Date();

    /** @type {Set} @desc A Set of the dates from all layers, used for findFutureDate() and findPastDate() */
    this._allLayerDates = new Set();

    // Set triggers and bindings
    window.addEventListener('resize', () => {
      this.resizeTimeline();
    });

    checkBrowser();
    // registerTriggers(); // TODO move all triggers into here?
    registerBindings(this.eventManager, this);
  }

  /**
   * Adds the specified layer to the timeline.
   * @param {Layer} layerToAdd A Geona layer definition.
   */
  addTimelineLayer(layerToAdd) {
    // Add this layer's times to the Set of all layer times
    let allDatetimes = this.geona.map.getActiveLayerDatetimes(layerToAdd.identifier);
    for (let datetime of allDatetimes) {
      this._allLayerDates.add(datetime);
    }

    // Sort the Set
    let setCopy = Array.from(this._allLayerDates).sort();
    this._allLayerDates = new Set(setCopy);


    // Increase timeline height to accommodate one new layer
    this.timelineCurrentLayers.push(layerToAdd);
    this._calculateHeights();
    this.updateLayerDateExtent();


    // Update xScale domain to show first layer's full extent
    if (this.timelineCurrentLayers.length === 1) {
      let allDates = this.geona.map.getActiveLayerDatetimes(layerToAdd.identifier);
      if (allDates.length > 1) {
        this._updateXScaleDomain(allDates);
      } else {
        let singleDomain = [
          new Date(allDates[0]).getTime() - this.SINGLE_TIME_EXTENT_MARGIN,
          new Date(allDates[0]).getTime() + this.SINGLE_TIME_EXTENT_MARGIN,
        ];
        this._updateXScaleDomain(singleDomain);
      }

      if (layerToAdd.dimensions.time.default) {
        this.selectorDate = layerToAdd.dimensions.time.default;
      }
    }


    // Update yScale range and domain
    // We need to check if any of the y-axis labels will be the same - if they are, we need to display the server too
    let allLayerLabels = [];
    for (let layer of this.timelineCurrentLayers) {
      allLayerLabels.push(selectPropertyLanguage(layer.getTitleOrDisplayName()));
    }
    let duplicateLayerLabels = new Set(); // We will put any elements which occur more than once in here
    for (let i = 0; i < allLayerLabels.length; i++) {
      let label = allLayerLabels[i];
      if (allLayerLabels.lastIndexOf(label) !== i) {
        duplicateLayerLabels.add(label);
      }
    }

    this.yScale.range([0, this.dataHeight])
      .domain(this.timelineCurrentLayers.map((layer) => {
        let label = selectPropertyLanguage(layer.getTitleOrDisplayName());
        // If this was found to be a duplicate, we want to get the label with source appended
        if (duplicateLayerLabels.has(label)) {
          if (layer.layerServer) {
            label = selectPropertyLanguage(layer.getTitleOrDisplayName()) + ' - ' + layer.identifier + ' - ' + layer.layerServer;
          } else {
            label = selectPropertyLanguage(layer.getTitleOrDisplayName()) + ' - ' + layer.identifier;
          }
        }
        this.yAxisFullLabels[layer.identifier] = label;
        return label;
      }));


    this.timelineLayerSelection = this.timelineData.selectAll('.js-geona-timeline-layer');
    // Create a g for each layer
    this.timelineLayerBars = this.timelineLayerSelection
      .remove().exit()
      .data(this.timelineCurrentLayers)
      .enter().append('g')
      .attr('class', 'js-geona-timeline-layer geona-timeline-layer')
      .attr('data-layer-identifier', (layer) => { // Adds the identifier as a data attribute
        return layer.identifier;
      })
      .attr('transform', (layer) => {
        let label = this.yAxisFullLabels[layer.identifier];
        return 'translate(0, ' + this.yScale(label) + ')';
      })
      // Within the g create a rect
      .append('rect')
      .attr('class', 'js-geona-timeline-layer-bar geona-timeline-layer-bar')
      .attr('x', (layer) => {
        let allDates = this.geona.map.getActiveLayerDatetimes(layer.identifier);
        return this.xScale(new Date(allDates[0]).getTime());
      })
      .attr('y', 0) // Alignment is relative to the group, so 0 always refers to the top position of the group.
      .attr('height', this.LAYER_HEIGHT)
      .attr('width', (layer) => {
        let allDates = this.geona.map.getActiveLayerDatetimes(layer.identifier);
        let startDateXPosition = this.xScale(new Date(allDates[0]).getTime());
        let endDateXPosition = this.xScale(new Date(allDates[allDates.length - 1]).getTime());
        return endDateXPosition - startDateXPosition;
      });

    this.timeline.attr('height', this.fullHeight); // Increase the height of the SVG element so we can view all layers
    // After changing the height we fire an event to indicate this fact
    this.eventManager.trigger('timePanel.heightChanged', this.geonaDiv);

    this.timelineXAxisGroup
      .attr('transform', 'translate(0, ' + (this.dataHeight + this.X_AXIS_SEPARATION - this.options.timelineMargins.bottom) + ')')
      .call(this.xAxis);
    this.timelineXAxisGroup.selectAll('.tick') // Set clickable axis labels
      .on('click', (dateLabel) => {
        d3.event.stopPropagation(); // Stops the click event on this.timeline from also firing
        this.selectorDate = dateLabel;
        this.triggerMapDateChange(this.selectorDate);
        this.moveSelectorToDate(this.selectorDate);
      });

    this.timelineYAxisGroup
      .call(this.yAxis)
      .raise()
      .select('.js-geona-timeline-y-axis-background')
      .attr('height', this.fullHeight);

    // Trim the visible title to prevent overspill onto the layer bars
    this.timelineYAxisGroup.selectAll('text')
      .attr('title', (title) => {
        return title;
      })
      .call((yAxisLabels) => {
        this._trimYAxisLabels(yAxisLabels);
      })
      .attr('class', 'js-geona-timeline-title-tippy')
      .on('mouseover', () => { // Set a tooltip to appear with the full title if we mouseover the trimmed title
        tippy('.js-geona-timeline-title-tippy', {
          arrow: true,
          placement: 'top-start',
          animation: 'fade',
          duration: 100,
          maxWidth: this.fullWidth + 'px',
          size: 'small',
        });
      });

    // Update the height and position of the todayLine
    this.todayLine
      .attr('y2', this.dataHeight + this.X_AXIS_SEPARATION) // Add the x-axis separation so we reach the axis
      .attr('x1', () => { // x1 and x2 are updated in case the xScale domain has been updated
        return this.xScale(this.todayDate);
      })
      .attr('x2', () => {
        return this.xScale(this.todayDate);
      });

    // Adjust the height of the selector tool for the new dataHeight and reorder to be in front of the new layer
    this.selectorTool
      .attr('height', this.dataHeight)
      .attr('x', () => { // Change x position in case domain has changed
        return this.xScale(new Date(this.selectorDate)) - this.SELECTOR_TOOL_CORRECTION;
      })
      .raise();

    // Add the time step markers to each layer
    for (let layer of this.timelineCurrentLayers) {
      this._addTimeStepMarkers(layer, this.geona.map.getActiveLayerDatetimes(layer.identifier));
    }

    // Update the pikaday max range
    let dates = Array.from(this._allLayerDates);
    this.eventManager.trigger('timePanel.setPikadayRange', [dates[0], dates[dates.length - 1]]);
  }

  /**
   * @private
   *
   * Adds the time step marker elements for the specified layer. Filters the dates used so only one line is drawn for
   * a particular pixel (prevents overlapping lines). Only draws time markers which are visible to improve performance.
   * @param {Object} layer    The definition for the layer we are using.
   * @param {Array}  allDates The collection of dates to insert markers for.
   */
  _addTimeStepMarkers(layer, allDates) {
    // Holds x pixels which have been used by another date in allDates
    let uniquePixels = new Set();
    // Only holds dates which will be drawn on different x pixels
    let filteredDates = [];

    // Sets the cutoff points - only dates for pixels between these cutoffs will be drawn
    let minimumCutoff = this.Y_AXIS_LABEL_WIDTH - this.TIME_MARKER_DRAW_MARGIN;
    let maximumCutoff = this.Y_AXIS_LABEL_WIDTH + this.dataWidth + this.TIME_MARKER_DRAW_MARGIN;

    for (let date of allDates) {
      // Check that the marker should be drawn
      if (this.xScale(new Date(date)) > minimumCutoff && this.xScale(new Date(date)) < maximumCutoff) {
        // We will check each date to see if it would be drawn on the same x pixel as another date
        let xPixel = Math.floor(this.xScale(new Date(date).getTime()));
        if (!uniquePixels.has(xPixel)) {
          // This pixel is currently free, so we will draw a line for this date
          uniquePixels.add(xPixel);
          filteredDates.push(date);
        }
      }
    }

    // We will append a line to the layer bar for each date remaining after being filtered
    this.timelineData.select('[data-layer-identifier = ' + layer.identifier + ']').selectAll('line')
      .data(filteredDates)
      .enter().append('line')
      .attr('class', 'js-geona-timeline-layer-time-marker geona-timeline-layer-time-marker')
      .attr('x1', (date) => {
        let xPosition = Math.floor(this.xScale(new Date(date).getTime()));
        return xPosition;
      })
      .attr('x2', (date) => {
        let xPosition = Math.floor(this.xScale(new Date(date).getTime()));
        return xPosition;
      })
      .attr('y1', 0)
      .attr('y2', this.LAYER_HEIGHT);
  }

  /**
   * Removes the layer with the specified identifier from the timeline.
   * @param {String} layerIdentifier The identifier for the layer to remove.
   */
  removeTimelineLayer(layerIdentifier) {
    // Remove the element from the SVG
    this.timelineData.select('[data-layer-identifier = ' + layerIdentifier + ']')
      .remove().exit();

    // Remove the layer from the current layers array
    let layerToRemove = this._findCurrentLayerDefinition(layerIdentifier);
    let layerIndex = this.timelineCurrentLayers.indexOf(layerToRemove);
    this.timelineCurrentLayers.splice(layerIndex, 1);

    // Remove the title from the yAxisFullLabels
    delete this.yAxisFullLabels[layerIdentifier];


    // Regenerate the Set of layer times
    let regeneratedSetDates = [];
    for (let layer of this.timelineCurrentLayers) {
      regeneratedSetDates = regeneratedSetDates.concat(this.geona.map.getActiveLayerDatetimes(layer.identifier));
    }
    regeneratedSetDates.sort();
    this._allLayerDates = new Set(regeneratedSetDates);


    this._calculateHeights();
    this.updateLayerDateExtent();

    // Update yScale range and domain
    // We need to check if any of the y-axis labels will be the same - if they are, we need to display the server too
    let allLayerLabels = [];
    for (let layer of this.timelineCurrentLayers) {
      allLayerLabels.push(selectPropertyLanguage(layer.getTitleOrDisplayName()));
    }
    let duplicateLayerLabels = new Set(); // We will put any elements which occur more than once in here
    for (let i = 0; i < allLayerLabels.length; i++) {
      let label = allLayerLabels[i];
      if (allLayerLabels.lastIndexOf(label) !== i) {
        duplicateLayerLabels.add(label);
      }
    }
    this.yScale.range([0, this.dataHeight])
      .domain(this.timelineCurrentLayers.map((layer) => {
        let label = selectPropertyLanguage(layer.getTitleOrDisplayName());
        // If this was found to be a duplicate, we want to get the label with source appended
        if (duplicateLayerLabels.has(label)) {
          if (layer.layerServer) {
            label = selectPropertyLanguage(layer.getTitleOrDisplayName()) + ' - ' + layer.layerServer;
          } else {
            label = selectPropertyLanguage(layer.getTitleOrDisplayName()) + ' - ' + layer.identifier;
          }
        }
        this.yAxisFullLabels[layer.identifier] = label;
        return label;
      }));

    this.timeline.attr('height', this.fullHeight); // Decrease the height of the SVG element
    // After changing the height we fire an event to indicate this fact
    this.eventManager.trigger('timePanel.heightChanged', this.geonaDiv);

    this.timelineXAxisGroup
      .attr('transform', 'translate(0, ' + (this.dataHeight + this.X_AXIS_SEPARATION - this.options.timelineMargins.bottom) + ')')
      .call(this.xAxis);
    this.timelineYAxisGroup
      .call(this.yAxis)
      .raise()
      .select('.js-geona-timeline-y-axis-background')
      .attr('height', this.fullHeight);

    // Vertically-align each layer bar with its title on the y-axis
    this.timelineData.selectAll('.js-geona-timeline-layer')
      .attr('transform', (layer) => {
        let label = this.yAxisFullLabels[layer.identifier];
        return 'translate(0, ' + this.yScale(label) + ')';
      });

    // Trim the visible title to prevent overspill onto the layer bars
    this.timelineYAxisGroup.selectAll('text')
      .call((yAxisLabels) => {
        this._trimYAxisLabels(yAxisLabels);
      })
      .on('mouseover', () => { // Refresh the full title tooltips
        tippy('.tippy', {
          arrow: true,
          placement: 'top-start',
          animation: 'fade',
          duration: 100,
          maxWidth: this.fullWidth + 'px',
          size: 'small',
        });
      });

    // Adjust the height of the today line
    this.todayLine.attr('y2', this.dataHeight + this.X_AXIS_SEPARATION); // Add the separation so we reach the axis

    // Adjust the height of the selector tool for the new dataHeight and reorder to be in front of the new layer
    this.selectorTool
      .attr('height', this.dataHeight)
      .attr('x', () => { // Change x position in case domain has changed
        return this.xScale(new Date(this.selectorDate)) - this.SELECTOR_TOOL_CORRECTION;
      })
      .raise();

    // Update the pikaday max range
    let dates = Array.from(this._allLayerDates);
    this.eventManager.trigger('timePanel.setPikadayRange', [dates[0], dates[dates.length - 1]]);
  }

  /**
   * @private
   *
   * Sets the xScale domain based on the minimum and maximum (min index and max index) dates supplied.
   * @param {Array}   allDates  Contains all dates, sorted from least-to-most recent, that we will use to set the view.
   * @param {Boolean} [padding] If true, try to add the left and right padding from the options.
   */
  _updateXScaleDomain(allDates, padding = true) {
    let leftPadding = 0;
    let rightPadding = 0;

    // Calculate the padding amount for each side
    let paddingPercent = this.options.paddingPercentage;
    if (padding === true && (paddingPercent.left || paddingPercent.right)) {
      let startDateMs = new Date(allDates[0]).getTime();
      let endDateMs = new Date(allDates[allDates.length - 1]).getTime();
      leftPadding = (endDateMs - startDateMs) * (paddingPercent.left / 100); // divide by 100 for percentage
      rightPadding = (endDateMs - startDateMs) * (paddingPercent.right / 100);
    }

    // Update the domain
    this.xScale.domain([
      new Date(allDates[0]).getTime() - leftPadding,
      new Date(allDates[allDates.length - 1]).getTime() + rightPadding,
    ]);
    this.xScale2.domain([
      new Date(allDates[0]).getTime() - leftPadding,
      new Date(allDates[allDates.length - 1]).getTime() + rightPadding,
    ]);
  }

  /**
   * @private
   * Updates the dataWidth and fullWidth variables to keep the correct proportions for the window size.
   */
  _calculateWidths() {
    this.fullWidth = this.geonaDiv.find('.js-geona-time-panel-container').width() -
      this.options.timelineMargins.left - this.options.timelineMargins.right;

    this.dataWidth = this.fullWidth - this.Y_AXIS_LABEL_WIDTH;

    this.xAxisTicks = this.dataWidth / 165; // More information can be found on the Geona wiki
  }

  /**
   * @private
   * Updates the dataHeight and fullHeight variables to keep the correct proportions for the window size.
   */
  _calculateHeights() {
    this.dataHeight = this.LAYER_HEIGHT * this.timelineCurrentLayers.length;
    this.fullHeight = this.dataHeight + this.X_AXIS_LABEL_HEIGHT;
  }

  /**
   * Handles panning and zooming along the x axis. Called on 'zoom' event.
   */
  zoom() {
    // We translate each layer along the x axis, and scale each layer horizontally
    // Update the domain based on the newly-transformed scale
    this.xScale.domain(d3.event.transform.rescaleX(this.xScale2).domain());

    // Update the x-axis display
    this.timelineXAxisGroup.call(this.xAxis);

    // Adjust the positioning of the layer bars
    this.timelineData.selectAll('.js-geona-timeline-layer-bar')
      .attr('x', (layer) => {
        let allDates = this.geona.map.getActiveLayerDatetimes(layer.identifier);
        let startDate = allDates[0];
        return this.xScale(new Date(startDate).getTime());
      })
      .attr('width', (layer) => {
        let allDates = this.geona.map.getActiveLayerDatetimes(layer.identifier);
        let startDate = allDates[0];
        let endDate = allDates[allDates.length - 1];
        return this.xScale(new Date(endDate).getTime()) - this.xScale(new Date(startDate).getTime());
      });

    // Remove the time markers - we need to redraw completely in case of pixel overlap (more info on wiki)
    this._redrawTimeMarkers();

    // Adjust positioning of today line and selector tool
    this._translateTodayLine();
    this._translateSelectorTool();

    // Reapply x-axis click event for any new label elements
    this.timelineXAxisGroup.selectAll('.tick') // Set clickable axis labels
      .on('click', (dateLabel) => {
        d3.event.stopPropagation(); // Stops the click event on this.timeline from also firing
        this.selectorDate = dateLabel;
        this.triggerMapDateChange(this.selectorDate);
        this.moveSelectorToDate(this.selectorDate);
      });
  }

  /**
   * Gets the date that was clicked, and calls the methods which update the time.
   * @param {SVGElement} container The element which was clicked.
   */
  clickDate(container) {
    // Get the x-coordinate (px) of the mouse click
    let clickXPosition = d3.mouse(container)[0];
    // Use the xScale to convert the x-coordinate to a date
    this.selectorDate = this.xScale.invert(clickXPosition);
    this.triggerMapDateChange(this.selectorDate);
    this.moveSelectorToDate(this.selectorDate);
  }

  /**
   * Sets the layerDateExtent to the minimum and maximum dates after checking every timeline layer.
   */
  updateLayerDateExtent() {
    this.layerDateExtent = {};
    for (let layer of this.timelineCurrentLayers) {
      let allDates = this.geona.map.getActiveLayerDatetimes(layer.identifier);
      if (allDates.length === 1) {
        if (new Date(allDates[0] - this.SINGLE_TIME_EXTENT_MARGIN) < this.layerDateExtent.min
          || this.layerDateExtent.min === undefined) {
          this.layerDateExtent.min = new Date(new Date(allDates[0]) - this.SINGLE_TIME_EXTENT_MARGIN);
        }
        if (new Date(allDates[0] + this.SINGLE_TIME_EXTENT_MARGIN) > this.layerDateExtent.max
          || this.layerDateExtent.max === undefined) {
          this.layerDateExtent.max = new Date(new Date(allDates[0]) + this.SINGLE_TIME_EXTENT_MARGIN);
        }
      } else {
        if (new Date(allDates[0]) < this.layerDateExtent.min || this.layerDateExtent.min === undefined) {
          this.layerDateExtent.min = new Date(allDates[0]);
        }
        if (new Date(allDates[allDates.length - 1]) > this.layerDateExtent.max || this.layerDateExtent.max === undefined) { // eslint-disable-line max-len
          this.layerDateExtent.max = new Date(allDates[allDates.length - 1]);
        }
      }
    }
  }

  /**
   * Sets the timeline date to the specified date. If date is outside the layerDateExtent then it will be capped at the
   * layerDateExtent min or max.
   * @param {String|Date} date The date to set the timeline to - will be restrained if outside the layerDateExtent.
   */
  triggerMapDateChange(date) {
    let validDate = date;
    if (date < this.layerDateExtent.min) {
      validDate = this.layerDateExtent.min;
    } else if (date > this.layerDateExtent.max) {
      validDate = this.layerDateExtent.max;
    }
    // TODO is trigger in correct way?
    this.eventManager.trigger('timePanel.timelineChangeTime', new Date(validDate));
  }

  /**
   * @private
   *
   * Moves the selector tool to the date position on the x-axis.
   * @param {String} date The date to move the selector tool to.
   */
  moveSelectorToDate(date) {
    this.selectorDate = date;
    if (date < this.layerDateExtent.min) {
      this.selectorDate = this.layerDateExtent.min;
    } else if (date > this.layerDateExtent.max) {
      this.selectorDate = this.layerDateExtent.max;
    }
    // Move the selector (optionally animated)
    if (this.options.animateSelector) {
      this.selectorTool
        .transition().duration(500)
        .attr('x', () => {
          return this.xScale(new Date(this.selectorDate)) - this.SELECTOR_TOOL_CORRECTION;
        });
    } else {
      this.selectorTool
        .attr('x', () => {
          return this.xScale(new Date(this.selectorDate)) - this.SELECTOR_TOOL_CORRECTION;
        });
    }

    // Pan the timeline if the selector has moved offscreen
    if (
      this.xScale(new Date(this.selectorDate)) < this.Y_AXIS_LABEL_WIDTH
      || this.xScale(new Date(this.selectorDate)) > this.Y_AXIS_LABEL_WIDTH + this.dataWidth
    ) {
      // Interrupts the transition - required so the selector will be drawn at its destination position after setView()
      this.selectorTool.interrupt();

      let minDomainTimeMs = this.xScale.domain()[0].getTime();
      let maxDomainTimeMs = this.xScale.domain()[1].getTime();
      let domainTimeDifferenceMs = maxDomainTimeMs - minDomainTimeMs;

      // Calculate a min and max domain - keeps the same date difference (scale) but centres on the selector date
      let newViewMinDatetime = new Date(new Date(this.selectorDate).getTime() - (domainTimeDifferenceMs / 2));
      let newViewMaxDatetime = new Date(new Date(this.selectorDate).getTime() + (domainTimeDifferenceMs / 2));

      this.setView([newViewMinDatetime, newViewMaxDatetime], false, this.options.animateSelector);
      this._translateSelectorTool();
    }
  }

  /**
   * Updates the position of the selector tool as it is dragged around.
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
      return this.xScale(new Date(this.selectorDate)) - this.SELECTOR_TOOL_CORRECTION;
    });

    // Update current date box as we drag
    this.eventManager.trigger('timePanel.pikadayUpdateGraphic', new Date(dragXDate));
  }

  /**
   * Programmatically zooms or pans so that the timeline view is set between the min and max of the specified dates.
   * @param {String[]} dates     Contains two or more dates, sorted from least-to-most recent.
   * @param {Boolean}  [padding] If True, the padding specified in options.paddingPercentage will be added on.
   * @param {Boolean}  [animate] If True, the view will animate smoothly to the new position.
   */
  setView(dates, padding = false, animate = false) {
    let firstDate = new Date(dates[0]);
    let lastDate = new Date(dates[dates.length - 1]);

    // Add optional padding to dates
    let paddingPercent = this.options.paddingPercentage;
    if (padding === true && (paddingPercent.left || paddingPercent.right)) {
      let msDateDifference = lastDate.getTime() - firstDate.getTime();
      firstDate = new Date(firstDate.getTime() - (msDateDifference / 100 * paddingPercent.left));
      lastDate = new Date(lastDate.getTime() + (msDateDifference / 100 * paddingPercent.right));
    }

    // The number of pixels between the min and max date for the current scale value (k)
    let pxDatesDifferenceAtCurrentScale = this.xScale(lastDate) - this.xScale(firstDate);
    // The ratio to multiply by to fit the min and max date into the domain
    let pxRatio = this.dataWidth / pxDatesDifferenceAtCurrentScale;
    // Scale in or out by the ratio
    if (animate) {
      this.zoomBehavior.scaleBy(this.timeline.transition().duration(500), pxRatio);
    } else {
      this.zoomBehavior.scaleBy(this.timeline, pxRatio);
    }

    // The pixel position of the minimum date at the new scale
    let pxPositionOfMinDate = this.xScale(firstDate);
    // The scale which has just been set by the scaleBy()
    let newScale = d3.zoomTransform(this.timeline.node()).k;
    // Translate the zoom behavior - need to multiply by '1 / newScale' because translateBy() changes the pixel values
    // so that they are based off the scale movement at k = 1.
    if (animate) {
      this.zoomBehavior.translateBy(
        this.timeline.transition().duration(500), (1 / newScale) * (this.Y_AXIS_LABEL_WIDTH - pxPositionOfMinDate), 0
      );
    } else {
      this.zoomBehavior.translateBy(this.timeline, (1 / newScale) * (this.Y_AXIS_LABEL_WIDTH - pxPositionOfMinDate), 0);
    }
  }

  /**
   * @private
   * Resizes the layer bars. Used when the xScale changes (e.g. on zoom).
   */
  _resizeLayerBars() {
    // Adjust the positioning of the layer bars
    this.timelineData.selectAll('.js-geona-timeline-layer-bar')
      .attr('x', (layer) => {
        let allDates = this.geona.map.getActiveLayerDatetimes(layer.identifier);
        let startDate = allDates[0];
        return this.xScale(new Date(startDate).getTime());
      })
      .attr('width', (layer) => {
        let allDates = this.geona.map.getActiveLayerDatetimes(layer.identifier);
        let startDate = allDates[0];
        let endDate = allDates[allDates.length - 1];
        return this.xScale(new Date(endDate).getTime()) - this.xScale(new Date(startDate).getTime());
      });
  }

  /**
   * @private
   * Redraws the time markers. Used when the xScale has zoomed or panned.
   */
  _redrawTimeMarkers() {
    // Remove the time markers - we need to redraw completely in case of pixel overlap (more info on wiki)
    this.timelineData.selectAll('.js-geona-timeline-layer-time-marker')
      .remove().exit();
    // Add time markers back
    for (let layer of this.timelineCurrentLayers) {
      this._addTimeStepMarkers(layer, this.geona.map.getActiveLayerDatetimes(layer.identifier));
    }
  }

  /**
   * @private
   * Moves the time markers on the x-axis. Used when the xScale has panned, and not zoomed.
   */
  _translateTimeMarkers() {
    this.timelineData.selectAll('.js-geona-timeline-layer-time-marker')
      .attr('x1', (date) => {
        let xPosition = Math.floor(this.xScale(new Date(date).getTime()));
        return xPosition;
      })
      .attr('x2', (date) => {
        let xPosition = Math.floor(this.xScale(new Date(date).getTime()));
        return xPosition;
      });
  }

  /**
   * @private
   * Moves the today line on the x-axis. Used when the xScale changes.
   */
  _translateTodayLine() {
    // Adjust positioning of the today line
    this.todayLine
      .attr('x1', () => {
        return this.xScale(this.todayDate);
      })
      .attr('x2', () => {
        return this.xScale(this.todayDate);
      });
  }

  /**
   * @private
   * Moves the selector tool on the x-axis. Used when the xScale changes.
   */
  _translateSelectorTool() {
    // Adjust positioning of the selector tool
    this.selectorTool
      .attr('x', () => {
        return this.xScale(new Date(this.selectorDate)) - this.SELECTOR_TOOL_CORRECTION;
      });
  }

  /**
   * @private
   *
   * Returns the layer in this.timelineCurrentLayers with the specified identifier, or undefined if not found.
   * @param {String} layerIdentifier The identifier for the currentLayer.
   * @return {Object|undefined} A layer from this.timelineCurrentLayers
   */
  _findCurrentLayerDefinition(layerIdentifier) {
    for (let layer of this.timelineCurrentLayers) {
      if (layer.identifier === layerIdentifier) {
        return layer;
      }
    }
    return undefined;
  }

  /**
   * @private
   *
   * Edits the text of the y-axis labels to prevent overspill onto the layer bars.
   * Only affects the displayed text - the yScale will still use the full titles.
   * @param {d3.Selection} yAxisLabels The selection of y-axis 'text' elements
   */
  _trimYAxisLabels(yAxisLabels) { // fixme this does not work if the timeline starts removed, then is revealed when a layer is added (see issue 112) https://gitlab.rsg.pml.ac.uk/web-development/geona/issues/112
    for (let textElement of yAxisLabels.nodes()) {
      if (textElement.getComputedTextLength() > this.Y_AXIS_LABEL_WIDTH) {
        // Gives us the percentage of text which is contained within the label area
        let trimProportion = this.Y_AXIS_LABEL_WIDTH / textElement.getComputedTextLength();
        // Gives us the number of characters we can fit into the label area from the full title
        let trimLength = Math.floor(textElement.textContent.length * trimProportion) - 3; // -3 makes space for '...'
        // Gives us the trimmed title, with ellipsis at end to indicate cutoff
        let trimmedLabel = textElement.textContent.slice(0, trimLength) + '...';

        textElement.textContent = trimmedLabel;
      }
    }
  }

  /**
   * Currently not working properly (see Geona issue 97) https://gitlab.rsg.pml.ac.uk/web-development/geona/issues/97
   * Redraws the Timeline elements for a new window width. Called when the window resizes.
   */
  resizeTimeline() {
    // resources https://stackoverflow.com/questions/25875316/d3-preserve-scale-translate-after-resetting-range http://jsfiddle.net/xf3fk8hu/9/ https://stackoverflow.com/questions/32959056/responsive-d3-zoom-behavior
    let minDomainDatetimeMs = this.xScale.domain()[0].getTime();
    let maxDomainDatetimeMs = this.xScale.domain()[1].getTime();
    console.log(minDomainDatetimeMs + ', ' + maxDomainDatetimeMs);
    let domainDatetimeDifferenceMs = maxDomainDatetimeMs - minDomainDatetimeMs;

    // let msPerPixel = (maxDomainDatetimeMs - minDomainDatetimeMs) / this.dataWidth;
    console.log(maxDomainDatetimeMs - minDomainDatetimeMs);
    // console.log(msPerPixel);

    // let transform = d3.zoomTransform(this.timeline.node());
    // let previousWidth = this.fullWidth * transform.k;
    let previousWidth = this.dataWidth;
    this._calculateWidths();
    let newWidth = this.dataWidth;

    let widthResizeProportion = newWidth / previousWidth;

    maxDomainDatetimeMs = minDomainDatetimeMs + (domainDatetimeDifferenceMs * widthResizeProportion);

    // let newWidth = this.fullWidth * transform.k;

    // maxDomainDatetimeMs = msPerPixel * this.dataWidth;
    console.log(maxDomainDatetimeMs);

    this.timeline
      .attr('width', this.fullWidth + 1); // +1 because the containing svg needs to be 1 px longer than inner elements


    this.xScale.range([this.Y_AXIS_LABEL_WIDTH, this.dataWidth + this.Y_AXIS_LABEL_WIDTH]);

    // this.xScale2.range([this.Y_AXIS_LABEL_WIDTH, this.dataWidth]);

    // Keep the domain the same

    // console.log('domain about to set');
    // console.log(new Date(minDomainDatetimeMs));
    // console.log(new Date(maxDomainDatetimeMs));
    // this.xScale.domain([
    //   new Date(minDomainDatetimeMs),
    //   new Date(maxDomainDatetimeMs),
    // ]);

    // this.zoomBehavior.transform(this.timeline, d3.zoomIdentity);

    // console.log('domain set');

    // let newX = -(newWidth * ((transform.x * -1) / previousWidth));

    // let translateBy = (newX - transform.x) / transform.k;

    // this.timeline.call(this.zoomBehavior.transform, transform.translate(translateBy, 0));

    let currentTransform = d3.zoomTransform(this.timeline.node());

    let resizeProportion = newWidth / previousWidth;

    // this.zoomBehavior.translateBy();
    // this.zoomBehavior.scaleBy(this.timeline, 1 / resizeProportion);
    // this.zoomBehavior.scaleTo(this.timeline, 1);


    this.xAxis.ticks(this.xAxisTicks);
    this.timelineXAxisGroup
      .call(this.xAxis);


    // Reposition data elements
    this._resizeLayerBars();
    this._redrawTimeMarkers();
    this._translateTodayLine();
    this._translateSelectorTool();

    console.log(d3.zoomTransform(this.timeline.node()));
  }

  /**
   * @summary
   * Traverses forward along the dates for the layers on the timeline, or of just one layer if specified, and
   * returns the date found after the specified number of intervals, along with the titles for the layers which
   * will change at that date.
   *
   * @description
   * This method is used to find dates in the future. The method will look ahead from the current time by the amount of
   * intervals specified - i.e. if the number of intervals was 1, the method would find the next time; if the number
   * of intervals was 2, the method would find the time after next. The dates searched are usually the dates for all
   * layers, but optionally a layer identifier can be specified, which means that only the times for that layer would
   * be considered. TODO Examples for these two behaviours can be found on the Geona wiki.
   *
   * Usually the method will return an Object containing a date property {String} and a layers property {String[]}. The
   * date property contains the date in ISO 8601 format. The layers property contains the titles for all the layers
   * whose times will be updated if the loadNearestValidTime method is called - for example, if two layers had a time
   * value of '2015-01-01T00:00:00.000Z' then both those layers' titles would be in the layers property. However, if the
   * current time is the maximum time in the list of dates, then the method will return undefined instead of an Object.
   *
   * @param  {Number} intervals         Number of times to traverse forwards before returning.
   * @param  {String} [layerIdentifier] The identifier for the selected layer whose times we want to check.
   *
   * @return {Object|undefined}         The date found on the final interval, and the layer(s) whose times will update.
   */
  findFutureDate(intervals, layerIdentifier) {
    // TODO write tests for this
    let listOfDates = Array.from(this._allLayerDates);
    // Only used if layerIdentifier has been specified
    let layerTitle;

    // If a layer has been supplied, we only want to traverse the times for that layer
    if (layerIdentifier) {
      for (let layer of this.timelineCurrentLayers) {
        if (layer.identifier === layerIdentifier) {
          layerTitle = selectPropertyLanguage(layer.title);
          listOfDates = this.geona.map.getActiveLayerDatetimes(layerIdentifier);
        }
      }
    }

    let startingDate = findNearestValidTime(listOfDates, this.selectorDate);
    let startingIndex;

    if (new Date(this.selectorDate) < new Date(listOfDates[0])) {
      // If the starting date is before the first time, we will increment to the 0th index upwards.
      startingIndex = -1;
    } else if (startingDate >= listOfDates[listOfDates.length - 1] || startingDate === undefined) {
      // If the current time is greater than or equal to the maximum time in the list, there isn't a time to move to
      return undefined;
    } else {
      startingIndex = listOfDates.indexOf(startingDate);
    }

    // Find the date we will move to
    let futureDate;
    // Check that we can move by the number of intervals
    if (listOfDates.length - 1 >= startingIndex + intervals) { // -1 so we are comparing the indices
      futureDate = listOfDates[startingIndex + intervals];
    } else { // Else, just set to the max date
      futureDate = listOfDates[listOfDates.length - 1];
    }

    // Find the layers which will change
    let changingLayers = [];

    if (layerIdentifier) { // If we selected a layer we can just use the title we found earlier
      changingLayers.push(layerTitle);
    } else { // If we don't have a layer identifier we need to check the current layers to see which ones will update
      for (let layer of this.timelineCurrentLayers) {
        let values = this.geona.map.getActiveLayerDatetimes(layer.identifier);
        let dateIndex = values.findIndex((value) => {
          // Required to avoid problems with date representation comparisons (info on wiki)
          return new Date(futureDate).getTime() === new Date(value).getTime();
        });
        if (dateIndex !== -1) {
          let title = selectPropertyLanguage(layer.title);
          changingLayers.push(title);
        }
      }
    }

    return {
      date: futureDate,
      layers: changingLayers,
    };
  }

  /**
   * @summary
   * Traverses backwards along the dates for the layers on the timeline, or of just one layer if specified, and
   * returns the date found after the specified number of intervals, along with the titles for the layers which
   * will change at that date.
   *
   * @description
   * This method is used to find dates in the past. The method will look back from the current time by the amount of
   * intervals specified - i.e. if the number of intervals was 1, the method would find the previous time; if the number
   * of intervals was 2, the method would find the time before that. The dates searched are usually the dates for all
   * layers, but optionally a layer identifier can be specified, which means that only the times for that layer would
   * be considered. TODO Examples for these two behaviours can be found on the Geona wiki.
   *
   * Usually the method will return an Object containing a date property {String} and a layers property {String[]}. The
   * date property contains the date in ISO 8601 format. The layers property contains the titles for all the layers
   * whose times will be updated if the loadNearestValidTime method is called - for example, if two layers had a time
   * value of '2015-01-01T00:00:00.000Z' then both those layers' titles would be in the layers property. However, if the
   * current time is the maximum time in the list of dates, then the method will return undefined instead of an Object.
   *
   * @param  {Number} intervals         Number of times to traverse forwards before returning.
   * @param  {String} [layerIdentifier] The identifier for the selected layer whose times we want to check.
   *
   * @return {IntervalDate|undefined}   The date found on the final interval, and the layer(s) whose times will update.
   */
  findPastDate(intervals, layerIdentifier) {
    // TODO write tests for this
    // Holds all the datetimes to consider when we are searching for the date - changes if layerIdentifier is defined
    let listOfDates = Array.from(this._allLayerDates);
    // Only used if layerIdentifier has been specified
    let layerTitle;

    // If a layer has been supplied, we only want to traverse the times for that layer
    if (layerIdentifier) {
      for (let layer of this.timelineCurrentLayers) {
        if (layer.identifier === layerIdentifier) {
          layerTitle = selectPropertyLanguage(layer.title);
          listOfDates = this.geona.map.getActiveLayerDatetimes(layer.identifier);
        }
      }
    }

    let startingDate = findNearestValidTime(listOfDates, this.selectorDate);
    let startingIndex;

    // findNearestValidTime() returns undefined if out of bounds, but if we are ahead, we want to load the end date
    if (new Date(this.selectorDate) > new Date(listOfDates[listOfDates.length - 1])) {
      startingIndex = listOfDates.length + 1; // If starting date is after the last time, we decrement to the last index downwards.
    } else // If the current time is less than or equal to the minimum time in the list, there isn't a time to move to
    if (new Date(startingDate) <= new Date(listOfDates[0]) || startingDate === undefined) {
      return undefined;
    } else {
      startingIndex = listOfDates.indexOf(startingDate);
    }

    // If the layer which contains the startingDate is currently out of bounds, we want to include the starting date as
    // one of the dates to count past (so that if we are out of bounds and go back 1, we set to the end date)
    if (new Date(this.selectorDate) > new Date(startingDate)) {
      let loadedLayers = 0;
      for (let layer of this.timelineCurrentLayers) {
        let values = this.geona.map.getActiveLayerDatetimes(layer.identifier);
        let valueIndex = values.findIndex((value) => {
          return new Date(startingDate).getTime() === new Date(value).getTime();
        });
        if (valueIndex !== -1 && valueIndex !== values.length - 1) {
          loadedLayers++;
        }
      }
      if (loadedLayers === 0) {
        startingIndex += 1;
      }
    }

    // Find the date we will move to
    let pastDate;
    // Check that we can move by the number of intervals
    if (startingIndex - intervals >= 0) {
      pastDate = listOfDates[startingIndex - intervals];
    } else { // Else, just set to the min date
      pastDate = listOfDates[0];
    }

    // Find the layers which will change
    let changingLayers = [];

    if (layerIdentifier) { // If we selected a layer we can just use the title we found earlier
      changingLayers.push(layerTitle);
    } else { // If we don't have a layer identifier we need to check the current layers to see which ones will update
      for (let layer of this.timelineCurrentLayers) {
        let values = this.geona.map.getActiveLayerDatetimes(layer.identifier);

        // Functions required to avoid problems with date representation comparisons
        // Searches the layer's time values for the pastDate and returns the index or -1
        let valueIndex = values.findIndex((value) => {
          return new Date(pastDate).getTime() === new Date(value).getTime();
        });
        // Searches the list of dates' values for the pastDate and returns the index or -1
        let setIndex = listOfDates.findIndex((value) => {
          return new Date(pastDate).getTime() === new Date(value).getTime();
        });

        // If the past date is in the layer's time values AND this time value is not the closest one currently loaded
        if (valueIndex !== -1 && new Date(listOfDates[setIndex + 1]) <= new Date(this.selectorDate)) {
          let title = selectPropertyLanguage(layer.title);
          changingLayers.push(title);
        }
      }
    }

    return {
      date: pastDate,
      layers: changingLayers,
    };
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

/**
 * Performs browser compatibility checks and fixes for the Timeline.
 * Each polyfill should be commented with the browser and the reason the polyfill is needed.
 */
function checkBrowser() {
  /* eslint-disable */ // eslint is disabled for this function, as polyfills can be quite old

  // IE11 - required for Tippy to work on the SVG text used for the titles
  if (SVGElement.prototype.contains === undefined) {
    SVGElement.prototype.contains = function contains(node) {
      if (!(0 in arguments)) {
        throw new TypeError('1 argument is required');
      }

      do {
        if (this === node) {
          return true;
        }
      } while (node = node && node.parentNode);

      return false;
    };
  }
}

/* Type definitions for this class */

/**
 * @typedef {Object} IntervalDate
 *   @property {String}   date   A datetime in ISO 8601 format.
 *   @property {String[]} layers The titles for the layers which will be updated.
 */
