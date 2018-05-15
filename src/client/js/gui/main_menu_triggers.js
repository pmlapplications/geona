import $ from 'jquery';
import dragula from 'dragula';

/**
 * Sets event triggers for main menu elements.
 * @param {EventManager} eventManager The event manager for the current instance of Geona.
 * @param {JQuery}       geonaDiv    The div which contains the current map.
 */
export function registerTriggers(eventManager, geonaDiv) {
  // Tracks the last tab that was clicked
  let lastTabClicked = ''; // fixme when loading from state this doesn't get updated (there's probably a better way anyway)

  // Open/close menu
  geonaDiv.find('.js-geona-menu-toggle').click(() => {
    if (geonaDiv.find('.js-geona-menu').hasClass('removed')) {
      eventManager.trigger('mainMenu.openMenu');
    } else {
      eventManager.trigger('mainMenu.closeMenu');
    }
  });


  /**
   *  Explore Panel - more triggers are set in the registerExploreTriggers() method
   */
  // Open/close panel
  geonaDiv.find('.js-geona-menu__explore').click(() => {
    if (!geonaDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__explore') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayExplorePanel');
    }
    lastTabClicked = 'js-geona-menu__explore';
  });


  /* ------------------------------------*\
      Layers Panel
  \* ------------------------------------*/
  // Open/close panel
  geonaDiv.find('.js-geona-menu__layers').click(() => {
    if (!geonaDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__layers') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayLayersPanel');
    }
    lastTabClicked = 'js-geona-menu__layers';
  });

  /* ------------------------------------*\
      Analysis Panel
  \* ------------------------------------*/
  // Open/close panel
  geonaDiv.find('.js-geona-menu__analysis').click(() => {
    if (!geonaDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__analysis') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayAnalysisPanel');
    }
    lastTabClicked = 'js-geona-menu__analysis';
  });

  /**
   * Login Panel
   */
  // Open/close panel
  geonaDiv.find('.js-geona-menu__login').click(() => {
    if (!geonaDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__login') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayLoginPanel');
    }
    lastTabClicked = 'js-geona-menu__login';
  });

  /**
   * Options Panel - more triggers are set in the registerOptionsTriggers() method
   */
  // Open/close panel
  geonaDiv.find('.js-geona-menu__options').click(() => {
    if (!geonaDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__options') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayOptionsPanel');
    }
    lastTabClicked = 'js-geona-menu__options';
  });

  /* ------------------------------------*\
      Help Panel
  \* ------------------------------------*/
  // Open/close panel
  geonaDiv.find('.js-geona-menu__help').click(() => {
    if (!geonaDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__help') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayHelpPanel');
    }
    lastTabClicked = 'js-geona-menu__help';
  });

  /* ------------------------------------*\
      Share Panel
  \* ------------------------------------*/
  // Open/close panel
  geonaDiv.find('.js-geona-menu__share').click(() => {
    if (!geonaDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__share') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displaySharePanel');
    }
    lastTabClicked = 'js-geona-menu__share';
  });
}

/**
 * Used by the main registerTriggers function to register triggers for
 * Explore panel elements which are not loaded at startup.
 * @param {EventManager} eventManager The event manager for the current instance of Geona.
 * @param {JQuery}       geonaDiv    The div which contains the current map.
 */
export function registerExploreTriggers(eventManager, geonaDiv) {
  // Scans for pre-cached URLs
  geonaDiv.find('.js-geona-explore-panel-content__layer-url').on('input', () => {
    // The current input
    let url = geonaDiv.find('.js-geona-explore-panel-content__layer-url').val();
    eventManager.trigger('mainMenu.scanCache', url);
    eventManager.trigger('mainMenu.autoselectService', url);
  });

  // Submit layer URL
  geonaDiv.find('.js-geona-explore-panel-content__add-url').click(() => {
    // The input URL
    let url = geonaDiv.find('.js-geona-explore-panel-content__layer-url').val();
    // The selected service type
    let service = geonaDiv.find('.js-geona-explore-panel-content__service option:selected').text();
    // Whether to save the config to the cache folder
    let save = false;
    // Whether to load the config from the cache folder
    let useCache = false;
    if (geonaDiv.find('.js-geona-explore-panel-content__cache-checkbox').prop('checked') ||
      geonaDiv.find('.js-geona-explore-panel-content__cache-checkbox').hasClass('removed')) {
      save = true;
    } else {
      useCache = true;
    }
    eventManager.trigger('mainMenu.getLayerServer', [url, service, save, useCache]);
  });

  // Update text to use or refresh cache
  geonaDiv.find('.js-geona-explore-panel-content__cache-checkbox').click(() => {
    let checked = geonaDiv.find('.js-geona-explore-panel-content__cache-checkbox').prop('checked');
    if (checked === true) {
      eventManager.trigger('mainMenu.addLayerButtonTextAsUrl', true);
    } else {
      eventManager.trigger('mainMenu.addLayerButtonTextAsUrl', false);
    }
  });

  // Add URL layer to map
  geonaDiv.find('.js-geona-explore-panel-content__add-layer').click(() => {
    let layerIdentifier = geonaDiv.find('.js-geona-explore-panel-content__layer-select').val();
    eventManager.trigger('mainMenu.addUrlLayerToMap', layerIdentifier);
  });

  // Add available layer to map
  geonaDiv.find('.js-geona-explore-panel-content__available-layers').change(() => {
    let option = geonaDiv.find('.js-geona-explore-panel-content__available-layers').val();
    if (option !== 'geona-available-layers-title') {
      eventManager.trigger('mainMenu.addAvailableLayerToMap', option);
    }
  });
}

/**
 * Used by the main registerTriggers function to register triggers for
 * Layers panel elements which are not loaded at startup.
 * @param {EventManager} eventManager The event manager for the current instance of Geona.
 * @param {JQuery}       geonaDiv    The div which contains the current map.
 */
export function registerLayersTriggers(eventManager, geonaDiv) {
  // Dragula reordering
  let dragger = dragula([geonaDiv.find('.js-geona-layers-list')[0]],
    {
      moves: (item, container, handle) => {
        return handle.classList.contains('js-geona-layers-list__item-header');
      },
    });
  dragger.on('drop', (item) => {
    eventManager.trigger('mainMenu.reorderLayers', [item]);
  });

  // Show layer
  geonaDiv.find('.js-geona-layers-list__item-header-icon-visibility-hiding').click((jQueryEvent) => {
    let item = jQueryEvent.target; // The HTML element which was clicked
    let identifier = $(jQueryEvent.target).closest('li')[0].dataset.identifier; // The layer id, stored in the dataset
    eventManager.trigger('mainMenu.showLayer', [identifier, item]);
  });

  // Hide layer
  geonaDiv.find('.js-geona-layers-list__item-header-icon-visibility-showing').click((jQueryEvent) => {
    let item = jQueryEvent.target; // The HTML element which was clicked
    let identifier = $(jQueryEvent.target).closest('li')[0].dataset.identifier; // The layer id, stored in the dataset
    eventManager.trigger('mainMenu.hideLayer', [identifier, item]);
  });

  // Toggle settings panel
  geonaDiv.find('.js-geona-layers-list__item-header-icon-settings').click((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    eventManager.trigger('mainMenu.toggleLayersPanelItemTab', [item, 'settings']);
  });

  // Toggle info panel
  geonaDiv.find('.js-geona-layers-list__item-header-icon-info').click((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    eventManager.trigger('mainMenu.toggleLayersPanelItemTab', [item, 'info']);
  });

  // Toggle analysis panel
  geonaDiv.find('.js-geona-layers-list__item-header-icon-analysis').click((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    eventManager.trigger('mainMenu.toggleLayersPanelItemTab', [item, 'analysis']);
  });

  // Remove layer
  geonaDiv.find('.js-geona-layers-list__item-header-icon-remove').click((jQueryEvent) => {
    // Finds the list element that contains the icon which was clicked
    let item = $(jQueryEvent.target).closest('li');
    eventManager.trigger('mainMenu.removeLayer', [item[0]]);
  });

  // Change layer min value - also calls reEnableAutoScale
  geonaDiv.find('.js-geona-layers-list__item-body-settings__scale-min').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li');
    let layerIdentifier = item[0].dataset.identifier;
    let min = jQueryEvent.target.value;
    let max = item.find('.js-geona-layers-list__item-body-settings__scale-max').val();
    let log = item.find('.js-geona-layers-list__item-body-settings__scale-logarithmic').prop('checked');
    eventManager.trigger('mainMenu.layersPanelScalebars.validateScale', [item, layerIdentifier, min, max, log]); // todo change this from layersPanelScalebars to something more reasonable (as part of splitting main manu up)
    eventManager.trigger('mainMenu.reEnableAutoScale', item);
  });

  // Change layer max value - also calls reEnableAutoScale
  geonaDiv.find('.js-geona-layers-list__item-body-settings__scale-max').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li');
    let layerIdentifier = item[0].dataset.identifier;
    let min = item.find('.js-geona-layers-list__item-body-settings__scale-min').val();
    let max = jQueryEvent.target.value;
    let log = item.find('.js-geona-layers-list__item-body-settings__scale-logarithmic').prop('checked');
    eventManager.trigger('mainMenu.layersPanelScalebars.validateScale', [item, layerIdentifier, min, max, log]); // todo change this from layersPanelScalebars to something more reasonable (as part of splitting main manu up)
    eventManager.trigger('mainMenu.reEnableAutoScale', item);
  });

  // Toggle layer logarithmic - also calls reEnableAutoScale
  geonaDiv.find('.js-geona-layers-list__item-body-settings__scale-logarithmic').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li');
    let layerIdentifier = item[0].dataset.identifier;
    let min = item.find('.js-geona-layers-list__item-body-settings__scale-min').val();
    let max = item.find('.js-geona-layers-list__item-body-settings__scale-max').val();
    let log = $(jQueryEvent.target).prop('checked');
    eventManager.trigger('mainMenu.layersPanelScalebars.validateScale', [item, layerIdentifier, min, max, log]); // todo change this from layersPanelScalebars to something more reasonable (as part of splitting main manu up)
    eventManager.trigger('mainMenu.reEnableAutoScale', item); // todo https://gitlab.rsg.pml.ac.uk/web-development/geona/issues/109
  });

  // Apply layer autoscale
  geonaDiv.find('.js-geona-layers-list__item-body-settings__scale-auto-scale').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    eventManager.trigger('mainMenu.applyAutoScale', item);
  });

  // Reset scale - also calls reEnableAutoScale
  geonaDiv.find('.js-geona-layers-list__item-body-settings__scale-reset').click((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let layerIdentifier = item.dataset.identifier;
    eventManager.trigger('mainMenu.layersPanelScalebars.resetScale', layerIdentifier);
    eventManager.trigger('mainMenu.reEnableAutoScale', item);
  });

  // Change layer opacity
  geonaDiv.find('.js-geona-layers-list__item-body-settings-opacity-range').on('input', (jQueryEvent) => {
    let value = $(jQueryEvent.target).val();
    let item = $(jQueryEvent.target).closest('li')[0];
    eventManager.trigger('mainMenu.changeLayerOpacity', [item, value]);
  });

  // Change layer elevation
  geonaDiv.find('.js-geona-layers-list__item-body-settings-elevation-select').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let layerIdentifier = item.dataset.identifier;
    let elevation = $(item).find('.js-geona-layers-list__item-body-settings-elevation-select').val();
    eventManager.trigger('mainMenu.changeElevationStyle', [layerIdentifier, elevation]);
  }); // todo also change the layer elevation in the analysis tab

  // Change layer style
  geonaDiv.find('.js-geona-layers-list__item-body-settings-styles-select').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let style = $(item).find('.js-geona-layers-list__item-body-settings-styles-select').val();
    eventManager.trigger('mainMenu.changeLayerStyle', [item, style]);
  });

  // Set below min color - contains show/hide below min color input
  geonaDiv.find('.js-geona-layers-list__item-body-settings__below-min-color').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let option = $(item).find('.js-geona-layers-list__item-body-settings__below-min-color option:selected').val();
    if (option === 'Custom') {
      eventManager.trigger('mainMenu.showBelowMinColorInput', item);
    } else {
      eventManager.trigger('mainMenu.hideBelowMinColorInput', item);
      eventManager.trigger('mainMenu.setBelowMinColor', [item, option]);
    }
  });
  // Set custom below min color
  geonaDiv.find('.js-geona-layers-list__item-body-settings__below-min-color-input__text').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let customColorHex = $(item).find('.js-geona-layers-list__item-body-settings__below-min-color-input__text').val();
    let option = '0x' + customColorHex;
    eventManager.trigger('mainMenu.setBelowMinColor', [item, option]);
  });
  geonaDiv.find('.js-geona-layers-list__item-body-settings__below-min-color-input__picker')
    .change((jQueryEvent) => {
      let item = $(jQueryEvent.target).closest('li')[0];
      let customColorHex = $(item).find('.js-geona-layers-list__item-body-settings__below-min-color-input__picker').val();
      // Remove the '#' from the color code
      customColorHex = customColorHex.slice(1);

      let option = '0x' + customColorHex;
      eventManager.trigger('mainMenu.setBelowMinColor', [item, option]);
    })
    .on('input', (jQueryEvent) => {
      let item = $(jQueryEvent.target).closest('li')[0];
      let customColorHex = $(item).find('.js-geona-layers-list__item-body-settings__below-min-color-input__picker').val();
      // Remove the '#' from the color code
      customColorHex = customColorHex.slice(1);
      eventManager.trigger('mainMenu.updateBelowMinColorGraphic', [item, customColorHex]);
    });

  // Set above max color - contains show/hide above max color input
  geonaDiv.find('.js-geona-layers-list__item-body-settings__above-max-color').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let option = $(item).find('.js-geona-layers-list__item-body-settings__above-max-color option:selected').val();
    if (option === 'Custom') {
      let customColorHex = $(item).find('.js-geona-layers-list__item-body-settings__above-max-color-input__text').val();
      option = '0x' + customColorHex;
      eventManager.trigger('mainMenu.showAboveMaxColorInput', item);
    } else {
      eventManager.trigger('mainMenu.hideAboveMaxColorInput', item);
      eventManager.trigger('mainMenu.setAboveMaxColor', [item, option]);
    }
  });
  geonaDiv.find('.js-geona-layers-list__item-body-settings__above-max-color-input__text').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let customColorHex = $(item).find('.js-geona-layers-list__item-body-settings__above-max-color-input__text').val();
    let option = '0x' + customColorHex;
    eventManager.trigger('mainMenu.setAboveMaxColor', [item, option]);
  });
  geonaDiv.find('.js-geona-layers-list__item-body-settings__above-max-color-input__picker')
    .change((jQueryEvent) => {
      let item = $(jQueryEvent.target).closest('li')[0];
      let customColorHex = $(item).find('.js-geona-layers-list__item-body-settings__above-max-color-input__picker').val();
      // Remove the '#' from the color code
      customColorHex = customColorHex.slice(1);

      let option = '0x' + customColorHex;
      eventManager.trigger('mainMenu.setAboveMaxColor', [item, option]);
    })
    .on('input', (jQueryEvent) => {
      let item = $(jQueryEvent.target).closest('li')[0];
      let customColorHex = $(item).find('.js-geona-layers-list__item-body-settings__above-max-color-input__picker').val();
      // Remove the '#' from the color code
      customColorHex = customColorHex.slice(1);
      eventManager.trigger('mainMenu.updateAboveMaxColorGraphic', [item, customColorHex]);
    });

  // Set number of color bands
  geonaDiv.find('.js-geona-layers-list__item-body-settings__color-bands-text').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let numColorBands = $(item).find('.js-geona-layers-list__item-body-settings__color-bands-text').val();
    eventManager.trigger('mainMenu.setNumberOfColorBands', [item, numColorBands]);
  });
  geonaDiv.find('.js-geona-layers-list__item-body-settings__color-bands-slider').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let numColorBands = $(item).find('.js-geona-layers-list__item-body-settings__color-bands-slider').val();
    eventManager.trigger('mainMenu.setNumberOfColorBands', [item, numColorBands]);
  });

  // Execute changes buffer
  geonaDiv.find('.js-geona-layers-list__item-body-settings__apply-changes').click((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let layerIdentifier = item.dataset.identifier;
    eventManager.trigger('mainMenu.executeChangesBuffer', layerIdentifier);
  });

  // Submit WCS URL
  geonaDiv.find('.js-geona-layers-list__item-body-analysis__no-wcs-url__submit-url').click((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let url = $(item).find('.js-geona-layers-list__item-body-analysis__no-wcs-url__wcs-url').val();
    eventManager.trigger('mainMenu.submitWcsUrl', [item, url]);
  });
}

/**
 * Used by the main registerTriggers function to register triggers for Options panel elements which are
 * not loaded at startup.
 * @param {EventManager} eventManager The event manager for the current instance of Geona.
 * @param {JQuery}       geonaDiv    The div which contains the current map.
 */
export function registerOptionsTriggers(eventManager, geonaDiv) {
  // Select basemap
  geonaDiv.find('.js-geona-options-panel-content__basemaps').change(function() {
    let option = geonaDiv.find('.js-geona-options-panel-content__basemaps').val();
    eventManager.trigger('mainMenu.setBasemap', option);
  });
  // Select borders
  geonaDiv.find('.js-geona-options-panel-content__borders').change(function() {
    let option = geonaDiv.find('.js-geona-options-panel-content__borders option:selected').val();
    let style = geonaDiv.find('.js-geona-options-panel-content__borders option:selected').data('style');
    eventManager.trigger('mainMenu.setBorders', [option, style]);
  });
  // Toggle graticule
  geonaDiv.find('.js-geona-options-panel-content__graticule').click(function() {
    if (geonaDiv.find('.js-geona-options-panel-content__graticule').prop('checked') === true) {
      eventManager.trigger('mainMenu.showGraticule');
    } else {
      eventManager.trigger('mainMenu.hideGraticule');
    }
  });
  // Select projection
  let previousProjection;
  let newProjection;
  geonaDiv.find('.js-geona-options-panel-content__projection').focus(() => {
    previousProjection = geonaDiv.find('.js-geona-options-panel-content__projection').val();
  }).change(() => {
    newProjection = geonaDiv.find('.js-geona-options-panel-content__projection').val();
    eventManager.trigger('mainMenu.setProjection', [previousProjection, newProjection]);
  });
}
