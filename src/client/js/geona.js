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
    this.parentDivId = undefined;
    initI18n().then(() => {
      this.parentDivId = this.config.get('divId');
      if (this.config.get('intro.termsAndConditions.require')) {
        this.loadTermsAndConditions_();
      } else {
        this.loadMainTemplate_();
      }
    });
  }

  /**
   * The first screen the user sees if terms and conditions are displayed, in which case the map will not be loaded
   * unless the accept button is clicked.
   * @private
   */
  loadTermsAndConditions_() {
    $(this.parentDivId).html(templates.terms_and_conditions());

    let backgroundImage = this.config.get('intro.termsAndConditions.backgroundImage');
    $(this.parentDivId + ' .js-geona-overlay').css('background-image', 'url(' + backgroundImage + ')');
    $(this.parentDivId + ' .js-geona-terms-and-conditions__accept').click(() => {
      $(this.parentDivId + ' .js-geona-terms-and-conditions').toggleClass('inactive', true);
      $(this.parentDivId + ' .js-geona-overlay').toggleClass('inactive', true);
      this.loadMainTemplate_();
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
  loadMainTemplate_() {
    $(this.parentDivId).html(templates.geona({}));
    this.initialiseMapDiv_();

    if (this.config.get('intro.splashScreen.display')) {
      $(this.parentDivId + ' .js-geona-overlay').css('background-image', 'url(' + this.config.get('intro.splashScreen.backgroundImage') + ')');
      $(this.parentDivId + ' .js-geona-overlay').toggleClass('inactive', false);
      $(this.parentDivId + ' .js-geona-overlay').append(templates.splash_screen({splashMessage: this.config.get('intro.splashScreen.html')}));
      $(this.parentDivId + ' .js-load-previous-map').click( () => {
        // TODO If previous, load, otherwise just normal map
        alert('Load from state');
      });
      $(this.parentDivId + ' .js-start-building-map').click( () => {
        $(this.parentDivId + ' .js-geona-splash-screen').toggleClass('inactive', true);
        $(this.parentDivId + ' .js-geona-overlay').toggleClass('inactive', true);
      });
    } else {
      $(this.parentDivId + ' .js-geona-overlay').toggleClass('inactive', true);
    }

    if (this.config.get('intro.menu.opened')) {
      $(this.parentDivId + ' .js-geona-controls').append(templates.menu({}));
    } else if (this.config.get('intro.menu.collapsible')) {
      $(this.parentDivId + ' .js-geona-controls').append(templates.menu_toggle_control({}));
      // TODO button onclick open menu and hide menu toggle control
    }

    // Because the layer menu may update while the layers pane is closed, we remove
    // and re-add the layers when closing and opening
    $(this.parentDivId + ' .js-geona-sidebar__layers').click( () => {
      if ($(this.parentDivId + ' .js-geona-panel-container').length === 0) {
        $(this.parentDivId + ' .js-geona-sidebar').append(templates.panel_container({}));
        $(this.parentDivId + ' .js-geona-panel-container').toggleClass('inactive', false);
        $(this.parentDivId + ' .js-geona-panel-container').append(templates.layers_pane({}));
        switch (this.config.get('map.library')) {
          case 'openlayers':
            for (let layer in this.map.availableLayers_) {
              let data = this.map.availableLayers_[layer].get('layerData');
              $(this.parentDivId + ' .js-geona-layers-list').append(templates.layers_list({data}));
            }
            break;
          case 'leaflet':
            break;
        }
      } else {
        $(this.parentDivId + ' .js-geona-panel-container').remove();
      }

      // Occurs last to apply sortable() to all new elements
      $(this.parentDivId + ' .js-sortable').sortable();
    });
  }
}
