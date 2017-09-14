import * as templates from '../../templates/compiled';
import {registerTriggers} from './splash_screen_triggers';
import {registerBindings} from './splash_screen_bindings';

/**
 * A splash screen to be shown when the map is loading.
 */
export class SplashScreen {
  /**
   * Creates a splash screen to provide information and cover the loading of the map.
   * @param {Gui} gui       The Gui for this instance of Geona.
   * @param {Object} config The config options relating to splash screens.
   */
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
    // variable only set to stop eslint from complaining about using 'this' - can be removed with the alert.
    this.eslintPleaser = alert('Need to save maps first. This alert is located in splash_screen.js');
  }
}
