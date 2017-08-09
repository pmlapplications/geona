import $ from 'jquery';
import * as templates from '../templates/compiled';
import Config from './config';
import * as leaflet from './map_leaflet';
import * as ol from './map_openlayers';

// TODO These are for testing only
window.templates = templates;
window.$ = $;


/**
 * The entry class for Geona.
 */
export class Geona {
  /**
   * Create a new Geona instance, optionally providing a client config.
   * @param  {Object} clientConfig A JSON client config.
   */
  constructor(clientConfig) {
    this.config = new Config(clientConfig);
    this.loadInitialTemplate_();
  }

  /**
   * The first screen the user sees if terms and conditions are displayed, in which case the map will not be loaded
   * unless the accept button is clicked.
   * @private
   */
  loadInitialTemplate_() {
    let parentDivId = this.config.get('divId');
    if (this.config.get('displayTermsAndConditions')) {
      $(parentDivId).html(templates.terms_and_conditions({}));
      $(parentDivId + ' .geona-overlay').css('background-image', 'url(' + this.config.get('termsAndConditionsImage') + ')');
      $(parentDivId + ' .agree-terms-and-conditions').click( () => {
        $(parentDivId + ' .terms-and-conditions').toggleClass('inactive', true);
        $(parentDivId + ' .geona-overlay').toggleClass('inactive', true);
        this.loadMainTemplate_(parentDivId);
        // TODO Save that T&C accepted
      });
    } else {
      this.loadMainTemplate_(parentDivId);
    }
  }

  /**
   * Finds the correct div to put the map in, then constructs the map.
   * @private
   */
  initialiseMapDiv_() {
    // Get the HTMLElement div to put the map in
    let mapDiv = $(this.config.get('divId') + ' .geona-map')[0];

    // TODO this should perhaps go a in seperate init method that returns a callback or promise
    switch (this.config.get('map.library')) {
      case 'openlayers':
        ol.init(() => {
          this.map = new ol.OlMap(this.config.get('map'), mapDiv);
        });
        break;
      case 'leaflet':
        leaflet.init(() => {
          this.map = new leaflet.LMap(this.config.get('map'), mapDiv);
        });
        break;
    }
  }

  /**
   * Add the geona template underneath the parent map div in the config
   * @private
   */
  loadMainTemplate_(parentDivId) {
    $(parentDivId).html(templates.geona({}));
    this.initialiseMapDiv_();

    if (this.config.get('displaySplashScreen')) {
      $(parentDivId + ' .geona-overlay').css('background-image', 'url(' + this.config.get('splashScreenImage') + ')');
      $(parentDivId + ' .geona-overlay').toggleClass('inactive', false);
      $(parentDivId + ' .geona-overlay').append(templates.splash_screen({splashMessage: this.config.get('splashScreenHtml')}));
      $(parentDivId + ' .load-previous-map').click( () => {
        // TODO If previous, load, otherwise just normal map
        alert('Load from state');
      });
      $(parentDivId + ' .start-building-map').click( () => {
        $(parentDivId + ' .geona-overlay').toggleClass('inactive', true);
      });
    }
  }
}
