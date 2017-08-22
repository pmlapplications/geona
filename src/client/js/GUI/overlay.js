import 'jquery';
import handlebars from 'handlebars/runtime';
import * as templates from '../../templates/compiled';
import {registerHelpers} from '../../../common/hbs_helpers';
import {OverlayTriggers} from './overlay_triggers';
import {OverlayBindings} from './overlay_bindings';

registerHelpers(handlebars);

/**
 * Loads templates, triggers, bindings and methods for GUI overlay elements.
 */
export class Overlay {
  /**
   * Loads the templates for overlay elements and instantiates the triggers and bindings.
   *
   * @param {Object} overlayConfigOptions The config options relating to overlay elements.
   * @param {*} parentDiv The div that the current map is located in.
   * @param {Gui} gui The parent Gui object.
   */
  constructor(overlayConfigOptions, parentDiv, gui) {
    this.config = overlayConfigOptions;
    this.parentDiv = parentDiv;
    this.gui = gui;

    if (this.config.splashScreen.display) {
      this.parentDiv.append(templates.splash_screen({splashMessage: this.config.splashScreen.html}));
      let backgroundImage = this.config.splashScreen.backgroundImage;
      parentDiv.find('.js-geona-splash-screen').css('background-image', 'url(' + backgroundImage + ')');
    }

    this.overlayTriggers = new OverlayTriggers(this.gui.eventManager, this.parentDiv);
    this.overlayBindings = new OverlayBindings(this.gui.eventManager, this);
  }

  /**
   * Removes the splash screen and presents a blank map.
   */
  startNewMap() {
    this.parentDiv.find('.js-geona-splash-screen').remove();
  }

  /**
   * TODO Removes the splash screen and places the saved map items on the map.
   */
  loadPreviousMap() {
    // TODO get previous map
    alert('Need to save maps first. This alert is located in overlay.js');
  }
}
