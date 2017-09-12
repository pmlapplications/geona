/**
 * Notepad for classes required for GUI
 * - Timeline
 * - Overlay
 * - Uservoice?
 * - T&C
 */

import handlebars from 'handlebars/runtime';
import $ from 'jquery';

import {EventManager} from '../../../common/event_manager';
import {registerHelpers} from '../../../common/hbs_helpers';
import * as templates from '../../templates/compiled';
import {MainMenu} from './main_menu';
import {SplashScreen} from './splash_screen';
import {TermsAndConditions} from './terms_and_conditions';
import {Timeline} from './timeline';

registerHelpers(handlebars);

/**
  * Manages the elements of the GUI. An element is a distinct part of the GUI.
  * For example, the main menu is a different element than the timeline, but the layers list is not a different element
  * than the main menu.
  */
export class Gui {
  /**
   * Initialises all the elements of the GUI.
   * @param {Geona} geona The geona instance for this GUI.
   */
  constructor(geona) {
    this.geona = geona;
    this.eventManager = new EventManager();

    // Get the parent div and add the 'geona-container' class to it
    this.parentDiv = $(this.geona.config.get('divId'));
    this.parentDiv.toggleClass('geona-container', true);
  }

  // TODO finish this jsdoc
  /**
   * 
   * @param {*} onReadyCallback 
   */
  init(onReadyCallback) {
    this.onReadyCallback_ = onReadyCallback;

    if (this.geona.config.get('intro.termsAndConditions.require')) {
      this.loadTermsAndConditionsScreen();
    } else {
      this.loadMainScreen();
    }
  }

  /**
   * Loads the terms and conditions template, and not the map, into the parent div.
   */
  loadTermsAndConditionsScreen() {
    this.termsAndConditions = new TermsAndConditions(this, this.geona.config.get('intro.termsAndConditions'));
  }

  /**
   * Loads the required GUI elements for the map into the parent div.
   */
  loadMainScreen() {
    // Load the main template
    this.parentDiv.html(templates.geona());

    // Get the HTMLElement div to put the map in
    let mapDiv = this.parentDiv.find('.geona-map')[0];

    // Load the map
    let mapPromise = this.geona.loadMap(mapDiv);

    let splashScreenConfig = this.geona.config.get('intro.splashScreen');
    if (splashScreenConfig.display) {
      this.splashScreen = new SplashScreen(this, splashScreenConfig);
    }

    let menuConfig = this.geona.config.get('controls.menu');
    this.mainMenu = new MainMenu(this, menuConfig);

    // TODO add timeline.js and triggers and bindings then create here and test register helpers
    let timelineConfig = this.geona.config.get('controls.timeline');
    this.timeline = new Timeline(this, timelineConfig);

    // When the map is ready, call the onReadyCallback
    mapPromise.then(this.onReadyCallback_);
  }
}
