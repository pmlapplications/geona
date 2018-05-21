/** @module splash_screen */

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
    this.geona = gui.geona;

    this.gui.geonaDiv.append(templates.splash_screen({splashMessage: config.content}));
    this.gui.geonaDiv.find('.js-geona-splash-screen').css('background-image', 'url(' + config.backgroundImage + ')');

    registerTriggers(this.geona.eventManager, this.gui.geonaDiv);
    registerBindings(this.geona.eventManager, this);
  }

  /**
   * Removes the splash screen and presents a blank map.
   */
  startNewMap() {
    this.gui.geonaDiv.find('.js-geona-splash-screen').remove();
  }

  /**
   * Removes the splash screen and loads the most recently-saved Geona state.
   */
  loadPreviousMap() {
    this.geona.loadGeonaStateFromBrowser();
    this.gui.geonaDiv.find('.js-geona-splash-screen').remove();
  }
}
