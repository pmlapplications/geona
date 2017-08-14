import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';
import handlebars from 'handlebars/runtime';
import * as templates from '../templates/compiled';
import Config from './config';
import * as leaflet from './map_leaflet';
import * as ol from './map_openlayers';
import {registerHelpers} from '../../common/hbs_helpers';
import {initI18n} from './i18n';

registerHelpers(handlebars);

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

    initI18n().then(() => {
      let parentDiv = $(this.config.get('divId'));
      parentDiv.toggleClass('geona-container', true);
      if (this.config.get('intro.termsAndConditions.require')) {
        this.loadTermsAndConditions_(parentDiv, () => {
          this.loadMainTemplate_(parentDiv);
        });
      } else {
        this.loadMainTemplate_(parentDiv);
      }
    });
  }

  /**
   * The first screen the user sees if terms and conditions are displayed, in which case the map will not be loaded
   * unless the accept button is clicked.
   * @private
   */
  loadTermsAndConditions_(parentDiv, next) {
    parentDiv.html(templates.terms_and_conditions());

    let backgroundImage = this.config.get('intro.termsAndConditions.backgroundImage');
    parentDiv.find('.js-geona-terms-and-conditions').css('background-image', 'url(' + backgroundImage + ')');
    parentDiv.find('.js-geona-terms-and-conditions__accept').click(() => {
      next();
      // TODO Save that T&C accepted
    });
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
  loadMainTemplate_(parentDiv) {
    parentDiv.html(templates.geona());
    this.initialiseMapDiv_();

    if (this.config.get('intro.splashScreen.display')) {
      parentDiv.append(templates.splash_screen({splashMessage: this.config.get('intro.splashScreen.html')}));
      parentDiv.find('.js-geona-splash-screen').css('background-image', 'url(' + this.config.get('intro.splashScreen.backgroundImage') + ')');
      parentDiv.find('.js-geona-splash-screen__load-previous').click( () => {
        // TODO If previous, load, otherwise just normal map
        alert('Load from state');
      });
      parentDiv.find('.js-geona-splash-screen__start-new').click( () => {
        parentDiv.find('.js-geona-splash-screen').remove();
      });
    }

    if (this.config.get('intro.menu.opened')) {
      parentDiv.find('.js-geona-controls').append(templates.menu({}));
      parentDiv.find('.geona-menu-open').append(templates.layers_list({}));
      $(() => {
        parentDiv.find('.sortable').sortable();
        parentDiv.find('.sortable').disableSelection();
      });
    } else if (this.config.get('intro.menu.collapsible')) {
      parentDiv.find('.js-geona-controls').append(templates.menu_toggle_control({}));
      // TODO button onclick open menu and hide menu toggle control
    }
  }
}
