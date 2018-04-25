/** @module time_panel */

import 'jquery';
import * as templates from '../../templates/compiled';
import Pikaday from 'pikaday-time';
import moment from 'moment';

import tippy from 'tippy.js';

import {Timeline} from './timeline';
import {registerTriggers} from './time_panel_triggers';
import {registerBindings} from './time_panel_bindings';

/**
 * Creates the GUI time panel.
 */
export class TimePanel {
  /**
   * Creates the timeline depending on the config options.
   * @param {Gui} gui                      The Gui for this instance of Geona.
   * @param {Object} timelineConfigOptions The config options relating to timelines.
   */
  constructor(gui, timelineConfigOptions) {
    // TODO make all instances of 'date' or 'time' into 'datetime'
    // TODO need to account for config options (allow toggle, and variants with no active layers
    this.gui = gui;
    this.geona = gui.geona;
    this.config = timelineConfigOptions;
    /** @type {JQuery} @desc The jQuery selection for the div which contains this instance of Geona */
    this.geonaDiv = gui.geonaDiv;

    /** @type {Number} @desc The number of datetimes to traverse when calling step methods with a 'short' value */
    this.SHORT_INTERVALS = 1;
    /** @type {Number} @desc The number of datetimes to traverse when calling step methods with a 'far' value */
    this.FAR_INTERVALS = 10;

    /** @type {Timeline} @desc The instance of the timeline that has been created for this instance of Geona */
    this.timeline = undefined;
    /** @type {Pikaday} @desc The Pikaday-time date picker that can be used to select datetimes */
    this.pikaday = undefined;

    /** @type {String} @desc The datetime to move to when a step method is called with the value 'prev-far' */
    this.datetimePrevFar = undefined;
    /** @type {String} @desc The datetime to move to when a step method is called with the value 'prev-short' */
    this.datetimePrevShort = undefined;
    /** @type {String} @desc The datetime to move to when a step method is called with the value 'next-short' */
    this.datetimeNextFar = undefined;
    /** @type {String} @desc The datetime to move to when a step method is called with the value 'next-far' */
    this.datetimeNextShort = undefined;

    /** @type {Number} @desc The width of the TimePanel container in px */
    this.fullWidth = this.geonaDiv.find('.js-geona-time-panel-container').width();

    /** @type {String} @desc The identifier for the currently selected layer on the timeline */
    this.activeLayer = undefined; // Currently there are no GUI controls for this, but the appropriate functions should be ready for use from the console

    this.geonaDiv.append(templates.time_panel());
    if (!this.config.opened) {
      this.geonaDiv.find('.js-geona-time-panel').addClass('removed');
    }
    if (!this.config.allowToggle) {
      this.geonaDiv.find('.js-geona-time-panel-toggle').remove();
    }

    // Pikaday widget - instantiated blank
    // TODO i18n for the pikaday
    this.pikaday = new Pikaday( // TODO try jquery version of pikaday
      {
        field: this.geonaDiv.find('.js-geona-time-panel-options-current-date')[0],
        format: 'YYYY-MM-DD HH:mm',
        use24hour: true,
        onSelect: (date) => {
          this.pikadayChangeTime(date);
        },
      }
    );

    // If the map has loaded before the GUI we will miss the event fire, so check to see if we can draw the timebar yet
    if (this.geona.map && this.geona.map.initialized) {
      this.drawTimeline();
    }

    registerTriggers(this.geona.eventManager, this.geonaDiv, this);
    registerBindings(this.geona.eventManager, this);
  }

  /**
   * Draws the SVG timeline and adds any currently active layers.
   * Only one timeline can be drawn at a time per instance of Geona.
   */
  drawTimeline() {
    if (this.timeline === undefined) {
    // Assign ID to this instance's timeline container
      let instanceId = this.geonaDiv.attr('id');
      this.geonaDiv.find('.js-geona-time-panel-timeline').attr('id', instanceId + '-timeline-container');

      this.timeline = new Timeline(this, {
        elementId: instanceId + '-timeline-container',
      });

      for (let layerIdentifier of Object.keys(this.geona.map.activeLayers)) {
        if (this.geona.map.layerGet(layerIdentifier, 'modifier') === 'hasTime') {
          let availableLayer = this.geona.map.availableLayers[layerIdentifier];
          this.timeline.addTimelineLayer(availableLayer);
        }
      }

      this.pikadayUpdateGraphic(this.timeline.selectorDate);
    }
  }

  /**
   * Removes the timeline from view, but not from the DOM.
   */
  hideTimePanel() {
    this.geonaDiv.find('.js-geona-time-panel').addClass('removed');
  }

  /**
   * Shows the timeline on the GUI.
   */
  showTimePanel() {
    this.geonaDiv.find('.js-geona-time-panel').removeClass('removed');
  }

  /**
   * Shows the Pikaday widget
   */
  showPikaday() {
    this.pikaday.show();
  }

  /**
   * Hides the Pikaday widget
   */
  hidePikaday() {
    this.pikaday.hide();
  }

  /**
   * Sets the min and max dates for the pikaday based on the active layers min and max.
   * @param {String|Date} startDate The date to set as the minimum.
   * @param {String|Date} endDate   The date to set as the maximum.
   */
  setPikadayRange(startDate, endDate) {
    // TODO nothing calls this currently - should happen when a new timeline layer is added I guess
    this.pikaday.setMinDate(new Date(startDate));
    this.pikaday.setMaxDate(new Date(endDate));
  }

  /**
   * Changes current date, updates the timeline and updates the map layers.
   * @param {String|Date} date The date to set the map to.
   */
  pikadayChangeTime(date) {
    this.geonaDiv.find('.js-geona-time-panel-options-current-date')
      .val(date);

    // Update map layers
    let utcDate = moment.utc(date);
    this.geona.map.loadLayersToNearestValidTime(utcDate);

    // Update timeline display
    this.timelineUpdateGraphic(date);
  }

  /**
   * Changes the pikaday date without changing the map layers.
   * @param {String|Date} time The datetime to set the current date box to.
   */
  pikadayUpdateGraphic(time) {
    // FIXME format doesn't work
    // let formattedTime = moment(time).format('YYYY-MM-DD HH:mm').toString();
    // console.log(formattedTime);
    // this.pikaday.setDate(formattedTime, true); // true parameter prevents 'onSelect' action on pikaday from triggering
    this.pikaday.setDate(time, true); // true parameter prevents 'onSelect' action on pikaday from triggering
  }

  /**
   * Called when the timeline is used to change the time.
   * Updates the pikaday and current-date text input, then calls mapChangeTime().
   * @param {String|Date} time Time in Date() parseable format.
   */
  timelineChangeTime(time) {
    this.pikadayUpdateGraphic(time);
    // update buttons
    this.geonaDiv.find('.js-geona-time-panel-options-current-date').val(time);
    this.mapChangeTime(time);
  }

  /**
   * Changes the display of the timeline without changing the map layers or any other components.
   * @param {String|Date} time Datetime to set the timeline to.
   */
  timelineUpdateGraphic(time) {
    this.timeline.moveSelectorToDate(time);
  }

  /**
   * Changes the times of the layers on the map
   * @param {String|Date} time Time in Date() parseable format
   */
  mapChangeTime(time) {
    this.geona.map.loadLayersToNearestValidTime(time);
    this._resetStepTimes();
  }

  /**
   * @private
   * Resets the button step times so they will be recalculated.
   */
  _resetStepTimes() {
    this.datetimePrevFar = undefined;
    this.datetimePrevShort = undefined;
    this.datetimeNextShort = undefined;
    this.datetimeNextFar = undefined;
  }

  /**
   * @private
   *
   * Finds the time for the specified step, sets the corresponding class variable, and returns the data.
   * @param {String} step The type of step to take ('prev-far', 'prev-short', 'next-short', 'next-far').
   * @return {HTMLElement|String} An HTML table containing the layers that will be set to a certain time, or 'No data'.
   */
  _setStepTime(step) {
    let data;
    switch (step) {
      case 'prev-far':
        if (this.datetimePrevFar === undefined) {
          this.datetimePrevFar = this.timeline.findPastDate(this.FAR_INTERVALS, this.activeLayer);
        }
        data = this.datetimePrevFar;
        break;
      case 'prev-short':
        if (this.datetimePrevShort === undefined) {
          this.datetimePrevShort = this.timeline.findPastDate(this.SHORT_INTERVALS, this.activeLayer);
        }
        data = this.datetimePrevShort;
        break;
      case 'next-short':
        if (this.datetimeNextShort === undefined) {
          this.datetimeNextShort = this.timeline.findFutureDate(this.SHORT_INTERVALS, this.activeLayer);
        }
        data = this.datetimeNextShort;
        break;
      case 'next-far':
        if (this.datetimeNextFar === undefined) {
          this.datetimeNextFar = this.timeline.findFutureDate(this.FAR_INTERVALS, this.activeLayer);
        }
        data = this.datetimeNextFar;
        break;
    }

    return data;
  }

  /**
   * Constructs an HTML table containing information about the specified datetime, and puts it into a tooltip for
   * the corresponding step button.
   * @param {String} step The step we are using ('prev-far', 'prev-short', 'next-short', 'next-far')
   */
  stepPreviewTime(step) {
    let data = this._setStepTime(step);

    let tooltipContent;
    if (data !== undefined) {
      let innerTableHtml = '';
      for (let i = 0; i < data.layers.length; i++) {
        let td = '<td>' + data.layers[i] + '</td>';
        if (i === 0) {
          td = td.concat('<td>' + data.date + '</td>');
        }
        let tr = '<tr>' + td + '</tr>';
        innerTableHtml = innerTableHtml.concat(tr);
      }
      tooltipContent = '<table>' + innerTableHtml + '</table>';
    } else {
      tooltipContent = 'No data';
    }

    this.geonaDiv.find('.js-geona-time-panel-options-prev-next__' + step)
      .attr('title', tooltipContent);

    // FIXME these tooltips don't update properly (so when they display a new tooltip it still has the old stuff too)
    tippy('.js-geona-time-panel-options-prev-next__' + step, {
      arrow: true,
      placement: 'top-end',
      animation: 'fade',
      duration: 100,
      maxWidth: this.fullWidth + 'px',
      size: 'small',
      dynamicTitle: true,
    });
  }

  /**
   * Changes the map time based on the step specified.
   * @param {String} step The step we are using ('prev-far', 'prev-short', 'next-short', 'next-far')
   */
  stepChangeTime(step) {
    let data = this._setStepTime(step);

    if (data !== undefined) {
      // update timeline
      this.timelineUpdateGraphic(data.date);
      // update pikaday
      this.pikadayUpdateGraphic(data.date);
      // update current date box
      this.geonaDiv.find('.js-geona-time-panel-options-current-date').val(data.date);
      this.mapChangeTime(data.date);

      // Time has changed so no longer valid
      this._resetStepTimes();
    }
  }

  /**
   * Sets the active timeline layer. Undefined means there is no active layer.
   * @param {String|undefined} [layerIdentifier] The identifier for the layer.
   */
  setActiveLayer(layerIdentifier = undefined) {
    this.activeLayer = layerIdentifier;
    this._resetStepTimes();
  }

  /**
   * Returns the contents of this.activeLayer.
   * @return {String} The identifier of the currently active timeline layer.
   */
  getActiveLayer() {
    return this.activeLayer;
  }
}
