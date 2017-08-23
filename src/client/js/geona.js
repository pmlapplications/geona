import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';

import * as templates from '../templates/compiled';
import Config from './config';
import * as leaflet from './map_leaflet';
import * as ol from './map_openlayers';
import {initI18n} from './i18n';
import {GeonaLayer} from './layer';
import {Gui} from './gui/gui';

// TODO These are for testing only
window.templates = templates;
window.$ = $;
window.GeonaLayer = GeonaLayer;

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
    this.layerNames = [];
    this.gui = new Gui(this);

    // Initialize i18n and then the GUI
    initI18n(this.config.get('geonaServer')).then(() =>{
      this.gui.init(() => {
        if (this.config.get('onReadyCallback')) {
          // If a onReadyCallback is defined in the config, try to call it
          try {
            window[this.config.get('onReadyCallback')](this);
          } catch (e) {
            console.error('Failed to call onReadyCallback: ' + e);
          }
        }
      });
    });
  }

  /**
   * Load the map into the provided div.
   * @param  {HTMLElement} mapDiv The HTML element to put the map in
   * @return {Promise}     Promise that resolves when the map has been loaded
   */
  loadMap(mapDiv) {
    // TODO this should perhaps go a in seperate init method that returns a callback or promise
    return new Promise((resolve) => {
      switch (this.config.get('map.library')) {
        case 'openlayers':
          ol.init(() => {
            this.map = new ol.OlMap(this.config.get('map'), mapDiv);
            resolve();
          });
          break;
        case 'leaflet':
          leaflet.init(() => {
            this.map = new leaflet.LMap(this.config.get('map'), mapDiv);
            resolve();
          });
          break;
      }
    });
  }
}

// Pre-conversion

// import $ from 'jquery';
// import 'jquery-ui/ui/widgets/sortable';
// import handlebars from 'handlebars/runtime';
// import * as templates from '../templates/compiled';
// import Config from './config';
// import * as leaflet from './map_leaflet';
// import * as ol from './map_openlayers';
// import {registerHelpers} from '../../common/hbs_helpers';
// import {initI18n} from './i18n';
// import {GeonaLayer} from './layer';
// import {Gui} from './gui';

// registerHelpers(handlebars);

// // TODO These are for testing only
// window.templates = templates;
// window.$ = $;
// window.GeonaLayer = GeonaLayer;

// /**
//  * The entry class for Geona.
//  */
// export class Geona {
//   /**
//    * Create a new Geona instance, optionally providing a client config.
//    * @param  {Object} clientConfig A JSON client config.
//    */
//   constructor(clientConfig) {
//     this.config = new Config(clientConfig);
//     this.layerNames = [];
//     initI18n().then(() => {
//       let parentDiv = $(this.config.get('divId'));
//       parentDiv.toggleClass('geona-container', true);
//       if (this.config.get('intro.termsAndConditions.require')) {
//         this.loadTermsAndConditions_(parentDiv, () => {
//           this.loadMainTemplate_(parentDiv);
//         });
//       } else {
//         this.loadMainTemplate_(parentDiv);
//       }
//     });
//   }

//   /**
//    * The first screen the user sees if terms and conditions are displayed, in which case the map will not be loaded
//    * unless the accept button is clicked.
//    * @private
//    */
//   loadTermsAndConditions_(parentDiv, next) {
//     parentDiv.html(templates.terms_and_conditions());

//     let backgroundImage = this.config.get('intro.termsAndConditions.backgroundImage');
//     parentDiv.find('.js-geona-terms-and-conditions').css('background-image', 'url(' + backgroundImage + ')');
//     parentDiv.find('.js-geona-terms-and-conditions__accept').click(() => {
//       next();
//       // TODO Save that T&C accepted
//     });
//   }

//   /**
//    * Finds the correct div to put the map in, then constructs the map.
//    * @private
//    */
//   initialiseMapDiv_() {
//     // Get the HTMLElement div to put the map in
//     let mapDiv = $(this.config.get('divId') + ' .geona-map')[0];

//     // TODO this should perhaps go a in seperate init method that returns a callback or promise
//     switch (this.config.get('map.library')) {
//       case 'openlayers':
//         ol.init(() => {
//           this.map = new ol.OlMap(this.config.get('map'), mapDiv);
//         });
//         break;
//       case 'leaflet':
//         leaflet.init(() => {
//           this.map = new leaflet.LMap(this.config.get('map'), mapDiv);
//         });
//         break;
//     }
//   }

//   /**
//    * Add the geona template underneath the parent map div in the config
//    * @private
//    */
//   loadMainTemplate_(parentDiv) {
//     parentDiv.html(templates.geona());
//     this.initialiseMapDiv_();

//     if (this.config.get('intro.splashScreen.display')) {
//       parentDiv.append(templates.splash_screen({splashMessage: this.config.get('intro.splashScreen.html')}));
//       parentDiv.find('.js-geona-splash-screen').css('background-image', 'url(' + this.config.get('intro.splashScreen.backgroundImage') + ')');
//       parentDiv.find('.js-geona-splash-screen__load-previous').click( () => {
//         // TODO If previous, load, otherwise just normal map
//         alert('Load from state');
//       });
//       parentDiv.find('.js-geona-splash-screen__start-new').click( () => {
//         parentDiv.find('.js-geona-splash-screen').remove();
//       });
//     }

//     if (this.config.get('intro.menu.opened')) {
//       parentDiv.find('.js-geona-controls').append(templates.menu({}));
//     } else if (this.config.get('intro.menu.collapsible')) {
//       parentDiv.find('.js-geona-controls').append(templates.menu_toggle_control({}));
//       // TODO button onclick open menu and hide menu toggle control
//     }

//     // Because the layer menu may update while the layers pane is closed, we remove
//     // and re-add the layers when closing and opening
//     parentDiv.find('.js-geona-sidebar__layers').click( () => {
//       if (parentDiv.find('.js-geona-panel-container').length === 0) {
//         parentDiv.find('.js-geona-sidebar').append(templates.panel_container({}));
//         parentDiv.find('.js-geona-panel-container').toggleClass('hidden', false);
//         parentDiv.find('.js-geona-panel-container').append(templates.layers_pane({}));
//         this.layerNames = [];
//         switch (this.config.get('map.library')) {
//           case 'openlayers':
//             for (let layer in this.map.availableLayers_) {
//               if (Object.prototype.hasOwnProperty.call(this.map.availableLayers_, layer)) {
//                 let data = this.map.availableLayers_[layer].get('layerData');
//                 if (data !== undefined) {
//                   let name = data.Name;
//                   parentDiv.find('.js-geona-layers-list').prepend(templates.layers_list({layerName: name, data: data}));
//                   this.layerNames.push(data.Name);
//                 } else { // TODO remove this once the data is available
//                   let name = 'ph_hcmr';
//                   parentDiv.find('.js-geona-layers-list').prepend(templates.layers_list({layerName: name, data: data}));
//                   this.layerNames.push('ph_hcmr');
//                 }
//               }
//             }
//             break;
//           case 'leaflet':
//             break;
//         }
//       } else {
//         parentDiv.find('.js-geona-panel-container').remove();
//       }

//       // Occurs last to apply sortable() to all new elements
//       parentDiv.find('.js-sortable').sortable({
//         stop: (event, ui) => {
//           // TODO I'm not confident this works correctly - test with three or more layers
//           let layersListToArray = parentDiv.find('.js-geona-layers-list').sortable('toArray', {attribute: 'value'});
//           this.map.removeLayer(layersListToArray[ui.item.index()]);
//           this.map.addLayer(layersListToArray[ui.item.index()], ui.item.index());
//         },
//       });
//     });
//   }
// }
