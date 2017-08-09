import $ from 'jquery';
import * as templates from '../templates/compiled';
import Config from './config';
import * as leaflet from './map_leaflet';
import * as ol from './map_openlayers';

// TODO These are for testing only
window.templates = templates;
window.$ = $;

let geona;

/**
 * The entry class for Geona.
 */
export class Geona {
  /**
   * Create a new Geona instance, optionally providing a client config.
   * @param  {Object} clientConfig A JSON client config.
   */
  constructor(clientConfig) {
    geona = this;
    geona.config = new Config(clientConfig);
    geona.loadInitialTemplate_();
  }

  /**
   * The first screen the user sees if terms and conditions are displayed, in which case the map will not be loaded
   * unless the accept button is clicked.
   */
  loadInitialTemplate_() {
    let parentDivId = geona.config.get('divId');
    $(parentDivId).html(templates.geona({parentDivId: parentDivId}));
    if (geona.config.get('displayTermsAndConditions')) {
      $(parentDivId + ' .geona-overlay').append(templates.terms_and_conditions({}));
      $(parentDivId + ' .geona-overlay').css('background-image', 'url(' + geona.config.get('termsAndConditionsImage') + ')');
      $(parentDivId + ' .agree-terms-and-conditions').click( function() {
        $(parentDivId + ' .terms-and-conditions').toggleClass('inactive', true);
        $(parentDivId + ' .geona-overlay').toggleClass('inactive', true);
        geona.loadMainTemplate_(parentDivId);
        // Save that T&C accepted
      });
    } else {
      geona.loadMainTemplate_(parentDivId);
    }
  }

  /**
   * Add the geona template underneath the parent map div in the config
   * @private
   */
  loadMainTemplate_(parentDivId) {
    // Get the HTMLElement div to put the map in
    let mapDiv = $(geona.config.get('divId') + ' .geona-map')[0];

    // TODO this should perhaps go a in seperate init method that returns a callback or promise
    switch (geona.config.get('map.library')) {
      case 'openlayers':
        ol.init(() => {
          geona.map = new ol.OlMap(geona.config.get('map'), mapDiv);
        });
        break;
      case 'leaflet':
        leaflet.init(() => {
          geona.map = new leaflet.LMap(geona.config.get('map'), mapDiv);
        });
        break;
    }

    if (geona.config.get('displaySplashScreen')) {
      $(parentDivId + ' .geona-overlay').css('background-image', 'url(' + geona.config.get('splashScreenImage') + ')');
      $(parentDivId + ' .geona-overlay').toggleClass('inactive', false);
      $(parentDivId + ' .geona-overlay').append(templates.splash_screen({splashMessage: geona.config.get('splashScreenHtml')}));
      $(parentDivId + ' .load-previous-map').click( function() {
        // If previous, load, otherwise just normal map
        alert('Load from state');
      });
      $(parentDivId + ' .start-building-map').click( function() {
        $(parentDivId + ' .geona-overlay').toggleClass('inactive', true);
      });
    }

    // if (geona.config.get('displaySplashScreen')) {
    //   $(parentDivId + ' .geona-overlay').append(templates.splash_screen({splashMessage: geona.config.get('splashScreenHtml')}));

    //   $(parentDivId + ' .load-previous-map').click( function() {
    //     // If previous, load, otherwise just normal map
    //     alert('Load from state');
    //   });
    //   let displayTermsAndConditions = geona.config.get('displayTermsAndConditions');
    //   $(parentDivId + ' .start-building-map').click( function() {
    //     if (displayTermsAndConditions) { // && T&C not accepted {
    //       $(parentDivId + ' .splash-screen').addClass('inactive');
    //       $(parentDivId + ' .geona-overlay').append(templates.terms_and_conditions({}));
    //       $(parentDivId + ' .agree-terms-and-conditions').click( function() {
    //         $(parentDivId + ' .geona-overlay').addClass('inactive');
    //         // Save that T&C accepted
    //       });
    //       $(parentDivId + ' .decline-terms-and-conditions').click( function() {
    //         $(parentDivId + ' .terms-and-conditions').addClass('inactive');
    //         $(parentDivId + ' .splash-screen').removeClass('inactive');
    //         // Save that T&C accepted
    //       });
    //     } else {
    //       $(parentDivId + ' .geona-overlay').addClass('inactive');
    //     }
    //   });
    //   // } else {
    //   // $(parentDivId + ' .geona-overlay').addClass('inactive');
    //   // }
    // } else if (geona.config.get('displayTermsAndConditions')) {
    //   $(parentDivId + ' .geona-overlay').append(templates.terms_and_conditions({}));
    //   $(parentDivId + ' .agree-terms-and-conditions').click( function() {
    //     $(parentDivId + ' .geona-overlay').addClass('inactive');
    //   // Save that T&C accepted
    //   });
    // }
  }
}
