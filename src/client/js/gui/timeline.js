import 'jquery';
// import {DataSet, Timeline as Timebar} from 'vis/index-timeline-graph2d';
import vis from 'vis';
import * as templates from '../../templates/compiled';
import {registerTriggers} from './timeline_triggers';
import {registerBindings} from './timeline_bindings';

/**
 * Creates the timeline section of the GUI.
 */
export class Timeline {
  /**
   * Creates the timeline depending on the config options.
   * @param {Gui} gui                      The Gui for this instance of Geona.
   * @param {Object} timelineConfigOptions The config options relating to timelines.
   */
  constructor(gui, timelineConfigOptions) {
    this.gui = gui;
    this.config = timelineConfigOptions;
    this.parentDiv = gui.parentDiv;

    this.parentDiv.append(templates.timeline());
    if (!this.config.opened) {
      this.parentDiv.find('.js-geona-timeline').addClass('hidden');
    }
    if (!this.config.collapsible) {
      this.parentDiv.find('.js-geona-timeline-toggle').remove();
    }

    // Instantiate timeline
    let container = this.parentDiv.find('.js-geona-timeline-inner__timebar')[0];
    // this.items = new vis.DataSet([
    //   {
    //     id: 'back1',
    //     type: 'background', style: 'height: 5px',
    //     start: '2008-05-05T00:00:00.000Z', end: '2011-03-04T00:00:00.000Z',
    //     group: 'layer1',
    //   },
    //   {
    //     id: '1-1',
    //     type: 'point', style: 'height: 5px',
    //     start: '2010-05-05T00:00:00.000Z',
    //     group: 'layer1',
    //   },
    //   {
    //     id: 'back2',
    //     type: 'background', style: 'height: 5px',
    //     start: '2010-05-05T00:00:00.000Z', end: '2012-03-04T00:00:00.000Z',
    //     group: 'layer2',
    //   },
    //   {
    //     id: '2-1',
    //     type: 'point', style: 'height: 5px',
    //     start: '2010-05-05T00:00:00.000Z',
    //     group: 'layer2',
    //   },
    // ]);
    // let options = {
    //   format: {
    //     minorLabels: {
    //       month: 'YYYY-MM',
    //       day: 'YYYY-MM-DD',
    //       weekday: 'YYYY-MM-DD',
    //       hour: 'YYYY-MM-DD HH:mm',
    //       minute: 'YYYY-MM-DD HH:mm',
    //       second: 'YYYY-MM-DD HH:mm',
    //     },
    //   },
    //   showCurrentTime: false,
    //   showMajorLabels: false,
    //   stack: false,
    //   selectable: false,
    //   width: 'calc(100% - 300px)',
    // };

    // // Content should be 27 chars, or if more, should be ... after character 24 (25, 26, 27 as dots)
    // let groups = new vis.DataSet([
    //   {
    //     id: 'layer1',
    //     content: 'layer 1',
    //     style: 'height: 5px; font-size: 10px',
    //   },
    //   {
    //     id: 'layer2',
    //     content: 'layer 2',
    //     style: 'height: 5px; font-size: 10px',
    //   },
    // ]);
    // let timebar = new vis.Timeline(container, this.items, groups, options);
    // timebar.addCustomTime(new Date(), 'slider');

    // D3 Timeline


    registerTriggers(this.gui.eventManager, this.parentDiv);
    registerBindings(this.gui.eventManager, this);
  }

  /**
   * Removes the timeline from view, but not from the DOM.
   */
  hideTimeline() {
    this.parentDiv.find('.js-geona-timeline').addClass('hidden');
  }

  /**
   * Shows the timeline on the GUI.
   */
  showTimeline() {
    this.parentDiv.find('.js-geona-timeline').removeClass('hidden');
  }
}
