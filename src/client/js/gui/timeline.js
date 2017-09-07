import 'jquery';
import handlebars from 'handlebars/runtime';
import * as templates from '../../templates/compiled';
import {registerHelpers} from '../../../common/hbs_helpers';
import {TimelineTriggers} from './timeline_triggers';
import {TimelineBindings} from './timeline_bindings';

export class Timeline {
  constructor(gui, timelineConfigOptions) {
    this.gui = gui;
    this.config = timelineConfigOptions;
    this.parentDiv = gui.parentDiv;

    // Whether to ever display the timeline
    if (!this.config.opened && !this.config.openOnLayerLoad && !this.config.collapsible) {
      // The timeline will never be displayed
    } else {
      this.parentDiv.append(templates.timeline());
      if (!this.config.opened) {
        this.parentDiv.find('.js-geona-timeline').addClass('hidden');
      }
      if (!this.config.collapsible) {
        this.parentDiv.find(',js-geona-timeline-toggle').remove();
      }
    }
  }

  /**
   * Removes the timeline from view, but not from the DOM
   */
  hideTimeline() {
    this.parentDiv.find('.js-geona-timeline').addClass('hidden');
  }

  /**
   * Shows the timeline on the GUI
   */
  showTimeline() {
    this.parentDiv.find('.js-geona-timeline').removeClass('hidden');
  }
}
