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
  // TODO buton dates don't change when other methods change the timeline
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

  timelineUpdateGraphic(time) {
    this.timeline._moveSelectorToDate(time);
  }

  /**
   * Changes the times of the layers on the map
   * @param {String} time Time in d3-timelines format (e.g. Sun Dec 12 2010 23:57:22 GMT+0000 (GMT))
   */
  mapChangeTime(time) {
    this.geona.map.loadLayersToNearestValidTime(time);
  }

  /**
   * writeme
   */
  buttonPrevFarPreviewTime() {
    if (this.dataPrevFar === undefined) {
      this.dataPrevFar = this.timeline.getPastDate(this.FAR_INTERVALS, this.activeLayer);
    }
    let tooltipContent;
    if (this.dataPrevFar !== undefined) {
      let innerTableHtml = '';
      for (let i = 0; i < this.dataPrevFar.layers.length; i++) {
        let td = '<td>' + this.dataPrevFar.layers[i] + '</td>';
        if (i === 0) {
          td = td.concat('<td>' + this.dataPrevFar.date + '</td>');
        }
        let tr = '<tr>' + td + '</tr>';
        innerTableHtml = innerTableHtml.concat(tr);
      }
      tooltipContent = '<table>' + innerTableHtml + '</table>';
    } else {
      tooltipContent = 'No data';
    }

    this.parentDiv.find('.js-geona-time-panel-options-prev-next__prev-far')
      .attr('title', tooltipContent);

    tippy('.js-geona-time-panel-options-prev-next__prev-far', {
      arrow: true,
      placement: 'top',
      animation: 'fade',
      duration: 100,
      maxWidth: this.fullWidth + 'px',
      size: 'small',
    });
  }

  /**
   * writeme
   */
  buttonPrevFarChangeTime() {
    if (this.dataPrevFar === undefined) {
      this.dataPrevFar = this.timeline.getPastDate(this.FAR_INTERVALS, this.activeLayer);
    }

    // update timeline
    this.timelineUpdateGraphic(this.dataPrevFar.date);
    // update pikaday
    this.pikadayUpdateGraphic(this.dataPrevFar.date);
    // update current date box
    this.parentDiv.find('.js-geona-time-panel-options-current-date').val(this.dataPrevFar.date);
    this.mapChangeTime(this.dataPrevFar.date);

    // Time has changed so no longer valid
    this.dataPrevFar = undefined;
    this.dataPrevShort = undefined;
    this.dataNextShort = undefined;
    this.dataNextFar = undefined;
  }

  /**
   * writeme
   */
  buttonPrevShortPreviewTime() {
    if (this.dataPrevShort === undefined) {
      this.dataPrevShort = this.timeline.getPastDate(this.SHORT_INTERVALS, this.activeLayer);
    }
    let tooltipContent;
    if (this.dataPrevShort !== undefined) {
      let innerTableHtml = '';
      for (let i = 0; i < this.dataPrevShort.layers.length; i++) {
        let td = '<td>' + this.dataPrevShort.layers[i] + '</td>';
        if (i === 0) {
          td = td.concat('<td>' + this.dataPrevShort.date + '</td>');
        }
        let tr = '<tr>' + td + '</tr>';
        innerTableHtml = innerTableHtml.concat(tr);
      }
      tooltipContent = '<table>' + innerTableHtml + '</table>';
    } else {
      tooltipContent = 'No data';
    }

    this.parentDiv.find('.js-geona-time-panel-options-prev-next__prev-short')
      .attr('title', tooltipContent);

    tippy('.js-geona-time-panel-options-prev-next__prev-short', {
      arrow: true,
      placement: 'top',
      animation: 'fade',
      duration: 100,
      maxWidth: this.fullWidth + 'px',
      size: 'small',
    });
  }

  /**
   * writeme
   */
  buttonPrevShortChangeTime() {
    if (this.dataPrevShort === undefined) {
      this.dataPrevShort = this.timeline.getPastDate(this.SHORT_INTERVALS, this.activeLayer);
    }

    // update timeline
    this.timelineUpdateGraphic(this.dataPrevShort.date);
    // update pikaday
    this.pikadayUpdateGraphic(this.dataPrevShort.date);
    // update current date box
    this.parentDiv.find('.js-geona-time-panel-options-current-date').val(this.dataPrevShort.date);
    this.mapChangeTime(this.dataPrevShort.date);

    // Time has changed so no longer valid
    this.dataPrevFar = undefined;
    this.dataPrevShort = undefined;
    this.dataNextShort = undefined;
    this.dataNextFar = undefined;
  }

  /**
   * writeme
   */
  buttonNextShortPreviewTime() {
    if (this.dataNextShort === undefined) {
      this.dataNextShort = this.timeline.getFutureDate(this.SHORT_INTERVALS, this.activeLayer);
    }
    let tooltipContent;
    if (this.dataNextShort !== undefined) {
      let innerTableHtml = '';
      for (let i = 0; i < this.dataNextShort.layers.length; i++) {
        let td = '<td>' + this.dataNextShort.layers[i] + '</td>';
        if (i === 0) {
          td = td.concat('<td>' + this.dataNextShort.date + '</td>');
        }
        let tr = '<tr>' + td + '</tr>';
        innerTableHtml = innerTableHtml.concat(tr);
      }
      tooltipContent = '<table>' + innerTableHtml + '</table>';
    } else {
      tooltipContent = 'No data';
    }

    this.parentDiv.find('.js-geona-time-panel-options-prev-next__next-short')
      .attr('title', tooltipContent);

    tippy('.js-geona-time-panel-options-prev-next__next-short', {
      arrow: true,
      placement: 'top',
      animation: 'fade',
      duration: 100,
      maxWidth: this.fullWidth + 'px',
      size: 'small',
    });
  }

  /**
   * writeme
   */
  buttonNextShortChangeTime() {
    if (this.dataNextShort === undefined) {
      this.dataNextShort = this.timeline.getFutureDate(this.SHORT_INTERVALS, this.activeLayer);
    }

    // update timeline
    this.timelineUpdateGraphic(this.dataNextShort.date);
    // update pikaday
    this.pikadayUpdateGraphic(this.dataNextShort.date);
    // update current date box
    this.parentDiv.find('.js-geona-time-panel-options-current-date').val(this.dataNextShort.date);
    this.mapChangeTime(this.dataNextShort.date);

    // Time has changed so no longer valid
    this.dataPrevFar = undefined;
    this.dataPrevShort = undefined;
    this.dataNextShort = undefined;
    this.dataNextFar = undefined;
  }

  /**
   * writeme
   */
  buttonNextFarPreviewTime() {
    if (this.dataNextFar === undefined) {
      this.dataNextFar = this.timeline.getFutureDate(this.FAR_INTERVALS, this.activeLayer);
    }
    let tooltipContent;
    if (this.dataNextFar !== undefined) {
      let innerTableHtml = '';
      for (let i = 0; i < this.dataNextFar.layers.length; i++) {
        let td = '<td>' + this.dataNextFar.layers[i] + '</td>';
        if (i === 0) {
          td = td.concat('<td>' + this.dataNextFar.date + '</td>');
        }
        let tr = '<tr>' + td + '</tr>';
        innerTableHtml = innerTableHtml.concat(tr);
      }
      tooltipContent = '<table>' + innerTableHtml + '</table>';
    } else {
      tooltipContent = 'No data';
    }

    this.parentDiv.find('.js-geona-time-panel-options-prev-next__next-far')
      .attr('title', tooltipContent);

    tippy('.js-geona-time-panel-options-prev-next__next-far', {
      arrow: true,
      placement: 'top',
      animation: 'fade',
      duration: 100,
      maxWidth: this.fullWidth + 'px',
      size: 'small',
    });
  }

  /**
   * writeme
   */
  buttonNextFarChangeTime() {
    if (this.dataNextFar === undefined) {
      this.dataNextFar = this.timeline.getFutureDate(this.FAR_INTERVALS, this.activeLayer);
    }

    // update timeline
    this.timelineUpdateGraphic(this.dataNextFar.date);
    // update pikaday
    this.pikadayUpdateGraphic(this.dataNextFar.date);
    // update current date box
    this.parentDiv.find('.js-geona-time-panel-options-current-date').val(this.dataNextFar.date);
    this.mapChangeTime(this.dataNextFar.date);

    // Time has changed so no longer valid
    this.dataPrevFar = undefined;
    this.dataPrevShort = undefined;
    this.dataNextShort = undefined;
    this.dataNextFar = undefined;
  }


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
