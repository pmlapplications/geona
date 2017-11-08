import 'jquery';
import 'd3';
import * as templates from '../../templates/compiled';
import {registerTriggers} from './timeline_triggers';
import {registerBindings} from './timeline_bindings';

/**
 * Creates a timeline for layers on the GUI.
 */
export class Timeline {
  /**
   * Creates a timeline depending on the config options.
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

    // Instantiate D3 timeline


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
