import 'jquery';
import * as templates from '../../templates/compiled';
import Pikaday from 'pikaday-time';
// import Pikaday from 'pikaday';
import moment from 'moment';

import tippy from 'tippy.js';

import {Timeline} from './timeline';
import {registerTriggers} from './time_panel_triggers';
import {registerBindings} from './time_panel_bindings';

/**
 * Creates the GUI time panel.
 */
export class TimePanel {
  // TODO keydown listeners
  /**
   * Creates the timeline depending on the config options.
   * @param {Gui} gui                      The Gui for this instance of Geona.
   * @param {Object} timelineConfigOptions The config options relating to timelines.
   */
  constructor(gui, timelineConfigOptions) {
    this.gui = gui;
    this.geona = gui.geona;
    this.config = timelineConfigOptions;
    this.parentDiv = gui.parentDiv;

    this.SHORT_INTERVALS = 1;
    this.FAR_INTERVALS = 10;

    this.timeline = undefined;
    this.pikaday = undefined;

    this.timePrevFar = undefined;
    this.timePrevShort = undefined;
    this.timeNextFar = undefined;
    this.timeNextShort = undefined;

    this.fullWidth = this.parentDiv.find('.js-geona-time-panel-container').width();

    this.activeLayer = undefined;

    this.parentDiv.append(templates.time_panel());
    if (!this.config.opened) {
      this.parentDiv.find('.js-geona-time-panel').addClass('removed');
    }
    if (!this.config.collapsible) {
      this.parentDiv.find('.js-geona-time-panel-toggle').remove();
    }

    // Pikaday widget - instantiated blank
    // TODO i18n for the pikaday
    this.pikaday = new Pikaday(
      {
        field: this.parentDiv.find('.js-geona-time-panel-options-current-date')[0],
        format: 'YYYY-MM-DD HH-mm', // FIXME
        onSelect: (date) => {
          this.pikadayChangeTime(date);
        },
      }
    );

    // If the map has loaded before the GUI we will miss the event fire, so check to see if we can draw the timebar yet
    if (this.geona.map) {
      if (this.geona.map.initialized) {
        this.drawTimeline();
      }
    }

    registerTriggers(this.geona.eventManager, this.parentDiv);
    registerBindings(this.geona.eventManager, this);
  }

  /**
   *
   */
  drawTimeline() {
    // Assign ID to this instance's timeline container
    let instanceId = this.parentDiv.attr('id');
    this.parentDiv.find('.js-geona-time-panel-timeline').attr('id', instanceId + '-timeline-container');

    this.timeline = new Timeline(this, {
      elementId: instanceId + '-timeline-container',
    });

    for (let layerIdentifier of Object.keys(this.geona.map._activeLayers)) {
      if (this.geona.map._layerGet(layerIdentifier, 'modifier') === 'hasTime') {
        let availableLayer = this.geona.map._availableLayers[layerIdentifier];
        this.timeline.addTimelineLayer(availableLayer);
      }
    }
  }

  /**
   * Removes the timeline from view, but not from the DOM.
   */
  hideTimePanel() {
    this.parentDiv.find('.js-geona-time-panel').addClass('removed');
  }

  /**
   * Shows the timeline on the GUI.
   */
  showTimePanel() {
    this.parentDiv.find('.js-geona-time-panel').removeClass('removed');
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
    this.pikaday.setMinDate(new Date(startDate));
    this.pikaday.setMaxDate(new Date(endDate));
  }

  /**
   * Changes current date, updates the timeline and updates the map layers.
   * @param {String|Date} date The date to set the map to.
   */
  pikadayChangeTime(date) {
    this.parentDiv.find('.js-geona-time-panel-options-current-date')
      .val(date);

    // Update map layers
    let utcDate = moment.utc(date);
    this.geona.map.loadLayersToNearestValidTime(utcDate);

    // Update timeline display
    this.timelineUpdateGraphic(date); // todo rename timelineUpdateDisplay
  }

  /**
   * Changes the pikaday date without changing the map layers.
   * @param {String|Date} time
   */
  pikadayUpdateGraphic(time) {
    this.pikaday.setDate(time, true); // true parameter prevents 'onSelect' action on pikaday from triggering
  }

  /**
   * Called when the timeline is used to change the time.
   * Updates the pikaday and current-date text input, then calls mapChangeTime()
   * @param {String} time Time in d3-timelines format (e.g. Sun Dec 12 2010 23:57:22 GMT+0000 (GMT))
   */
  timelineChangeTime(time) {
    this.pikadayUpdateGraphic(time);
    // update buttons
    this.parentDiv.find('.js-geona-time-panel-options-current-date').val(time);
    this.mapChangeTime(time);
  }

  /**
   * Changes the display of the timeline without changing the map layers or any other components.
   * @param {String|Date} time
   */
  timelineUpdateGraphic(time) {
    this.timeline._moveSelectorToDate(time);
  }

  /**
   * Changes the times of the layers on the map
   * @param {String} time Time in d3-timelines format (e.g. Sun Dec 12 2010 23:57:22 GMT+0000 (GMT))
   */
  mapChangeTime(time) {
    this.geona.map.loadLayersToNearestValidTime(time);
    this._resetButtonTimes();
  }

  /**
   * @private
   * Resets the button step times so they will be recalculated.
   */
  _resetButtonTimes() {
    this.dataPrevFar = undefined;
    this.dataPrevShort = undefined;
    this.dataNextShort = undefined;
    this.dataNextFar = undefined;
  }

  /**
   * @private
   *
   * Finds the time for the specified button, sets the corresponding class variable, and returns the data
   * @param {*} button 
   */
  _setButtonTime(button) {
    let data;
    switch (button) {
      case 'prev-far':
        if (this.dataPrevFar === undefined) {
          this.dataPrevFar = this.timeline.findPastDate(this.FAR_INTERVALS, this.activeLayer);
        }
        data = this.dataPrevFar;
        break;
      case 'prev-short':
        if (this.dataPrevShort === undefined) {
          this.dataPrevShort = this.timeline.findPastDate(this.SHORT_INTERVALS, this.activeLayer);
        }
        data = this.dataPrevShort;
        break;
      case 'next-short':
        if (this.dataNextShort === undefined) {
          this.dataNextShort = this.timeline.findFutureDate(this.SHORT_INTERVALS, this.activeLayer);
        }
        data = this.dataNextShort;
        break;
      case 'next-far':
        if (this.dataNextFar === undefined) {
          this.dataNextFar = this.timeline.findFutureDate(this.FAR_INTERVALS, this.activeLayer);
        }
        data = this.dataNextFar;
        break;
    }

    return data;
  }

  /**
   * writeme
   * @param {String} button The button we are using ('prev-far', 'prev-short', 'next-short', 'next-far')
   */
  buttonPreviewTime(button) {
    let data = this._setButtonTime(button);

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

    this.parentDiv.find('.js-geona-time-panel-options-prev-next__' + button)
      .attr('title', tooltipContent);

    tippy('.js-geona-time-panel-options-prev-next__' + button, {
      arrow: true,
      placement: 'top',
      animation: 'fade',
      duration: 100,
      maxWidth: this.fullWidth + 'px',
      size: 'small',
      dynamicTitle: true,
    });
  }

  /**
   * writeme
   */
  buttonChangeTime(button) {
    let data = this._setButtonTime(button);

    if (data !== undefined) {
      // update timeline
      this.timelineUpdateGraphic(data.date);
      // update pikaday
      this.pikadayUpdateGraphic(data.date);
      // update current date box
      this.parentDiv.find('.js-geona-time-panel-options-current-date').val(data.date);
      this.mapChangeTime(data.date);

      // Time has changed so no longer valid
      this._resetButtonTimes();
    }
  }

  /**
   * Sets the active timeline layer. Undefined means there is no active layer.
   * @param {String|undefined} layerIdentifier The ID for the layer (maybe should be title)
   */
  setActiveLayer(layerIdentifier = undefined) {
    this.activeLayer = layerIdentifier;
    this.timePrevFar = undefined;
    this.timePrevShort = undefined;
    this.timeNextShort = undefined;
    this.timeNextFar = undefined;
  }

  getActiveLayer() {
    return this.activeLayer;
  }
}
