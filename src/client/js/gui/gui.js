/** @module gui */

import handlebars from 'handlebars/runtime';
import 'jquery';

import {registerHelpers} from '../../../common/hbs_helpers';
import * as templates from '../../templates/compiled';
import {MainMenu} from './main_menu';
import {SplashScreen} from './splash_screen';
import {TermsAndConditions} from './terms_and_conditions';
import {TimePanel} from './time_panel';

registerHelpers(handlebars);

/**
  * Manages the elements of the GUI. An element is a distinct part of the GUI.
  * For example, the main menu is a different element than the timeline, but the layers list is not a different element
  * than the main menu.
  */
export class Gui {
  /**
   * Initialises all the elements of the GUI.
   * @param {Geona} geona The Geona instance for this GUI.
   */
  constructor(geona) {
    /** This instance of Geona. Used to gain access to the map from the GUI. @type {Geona} */
    this.geona = geona;
    /** The div containing this instance of Geona. Used to find the correct GUI elements. @type {HTMLElement} */
    this.geonaDiv = this.geona.geonaDiv;

    /** The terms and conditions class which displays Ts&Cs before loading the map. @type {TermsAndConditions} */
    this.termsAndConditions = undefined;
    /** The splash screen class which displays an overlay on top of the map on load. @type {SplashScreen} */
    this.splashScreen = undefined;
    /** The main menu class which displays the main menu on top of the map. @type {MainMenu} */
    this.mainMenu = undefined;
    /** The time panel class which displays timeline controls on top of the map. @type {TimePanel} */
    this.timePanel = undefined;

    /** The name of a window function to call once the map has finished initialising. @type {String} @private */
    this._onReadyCallback = undefined;
  }

  /**
   * Initialises the map by calling either the terms and conditions screen, or the main map screen.
   * @param {String} onReadyCallback The name of a window function to call once the map has finished initialising.
   */
  init(onReadyCallback) {
    this._onReadyCallback = onReadyCallback;

    if (this.geona.config.get('intro.termsAndConditions.require')) {
      this.loadTermsAndConditionsScreen();
    } else {
      this.loadMainScreen();
    }
  }

  /**
   * Loads the terms and conditions template, and not the map, into the Geona div.
   */
  loadTermsAndConditionsScreen() {
    this.termsAndConditions = new TermsAndConditions(this, this.geona.config.get('intro.termsAndConditions'));
  }

  /**
   * Loads the required GUI elements for the map into the Geona div.
   */
  loadMainScreen() {
    // Load the main template
    this.geonaDiv.html(templates.geona());

    // Get the HTMLElement div to put the map in
    let mapDiv = this.geonaDiv.find('.geona-map')[0];

    // Load the map
    let mapPromise = this.geona.loadMap(mapDiv); // todo I feel like this should go outside the GUI somehow, just for separation concerns

    let splashScreenConfig = this.geona.config.get('intro.splashScreen');
    if (splashScreenConfig.display) {
      this.splashScreen = new SplashScreen(this, splashScreenConfig);
    }

    // When the map is ready, call the onReadyCallback
    mapPromise.then(() => {
      let menuConfig = this.geona.config.get('controls.menu');
      this.mainMenu = new MainMenu(this, menuConfig);

      let timelineConfig = this.geona.config.get('controls.timeline');
      this.timePanel = new TimePanel(this, timelineConfig);

      this._onReadyCallback();
    });
  }
}
