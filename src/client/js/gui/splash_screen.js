import * as templates from '../../templates/compiled';
import {registerTriggers} from './splash_screen_triggers';
import {registerBindings} from './splash_screen_bindings';

export class SplashScreen {
  constructor(gui, config) {
    this.gui = gui;

    this.gui.parentDiv.append(templates.splash_screen({splashMessage: config.content}));
    this.gui.parentDiv.find('.js-geona-splash-screen').css('background-image', 'url(' + config.backgroundImage + ')');

    registerTriggers(this.gui.eventManager, this.gui.parentDiv);
    registerBindings(this.gui.eventManager, this);
  }

  /**
   * Removes the splash screen and presents a blank map.
   */
  startNewMap() {
    this.gui.parentDiv.find('.js-geona-splash-screen').remove();
  }

  /**
   * TODO Removes the splash screen and places the saved map items on the map.
   */
  loadPreviousMap() {
    // TODO get previous map
    alert('Need to save maps first. This alert is located in splash_screen.js');
  }
}
