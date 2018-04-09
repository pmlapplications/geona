import $ from 'jquery';
import dragula from 'dragula';

/**
 * Sets event triggers for main menu elements.
 * @param {EventManager} eventManager The event manager for the current instance of Geona.
 * @param {JQuery}       parentDiv    The div which contains the current map.
 */
export function registerTriggers(eventManager, parentDiv) {
  // Tracks the last tab that was clicked
  let lastTabClicked = '';

  // Open/close menu
  parentDiv.find('.js-geona-menu-toggle').click(() => {
    if (parentDiv.find('.js-geona-menu').hasClass('removed')) {
      eventManager.trigger('mainMenu.openMenu');
    } else {
      eventManager.trigger('mainMenu.closeMenu');
    }
  });


  /**
   *  Explore Panel - more triggers are set in the registerExploreTriggers() method
   */
  // Open/close panel
  parentDiv.find('.js-geona-menu__explore').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__explore') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayExplorePanel');
      registerExploreTriggers(eventManager, parentDiv);
    }
    lastTabClicked = 'js-geona-menu__explore';
  });


  /* ------------------------------------*\
      Layers Panel
  \* ------------------------------------*/
  // Open/close panel
  parentDiv.find('.js-geona-menu__layers').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__layers') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayLayersPanel');
      registerLayersTriggers(eventManager, parentDiv);
    }
    lastTabClicked = 'js-geona-menu__layers';
  });

  /* ------------------------------------*\
      Analysis Panel
  \* ------------------------------------*/
  // Open/close panel
  parentDiv.find('.js-geona-menu__analysis').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__analysis') {
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
  parentDiv.find('.js-geona-menu__login').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__login') {
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
  parentDiv.find('.js-geona-menu__options').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__options') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayOptionsPanel');
      registerOptionsTriggers(eventManager, parentDiv);
    }
    lastTabClicked = 'js-geona-menu__options';
  });

  /* ------------------------------------*\
      Help Panel
  \* ------------------------------------*/
  // Open/close panel
  parentDiv.find('.js-geona-menu__help').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__help') {
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
  parentDiv.find('.js-geona-menu__share').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('removed') && lastTabClicked === 'js-geona-menu__share') {
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
 * @param {JQuery}       parentDiv    The div which contains the current map.
 */
function registerExploreTriggers(eventManager, parentDiv) {
  // Scans for pre-cached URLs
  parentDiv.find('.js-geona-explore-panel-content__layer-url').on('input', () => {
    // The current input
    let url = parentDiv.find('.js-geona-explore-panel-content__layer-url').val();
    eventManager.trigger('mainMenu.scanCache', url);
    eventManager.trigger('mainMenu.autoselectService', url);
  });

  // Submit layer URL
  parentDiv.find('.js-geona-explore-panel-content__add-url').click(() => {
    // The input URL
    let url = parentDiv.find('.js-geona-explore-panel-content__layer-url').val();
    // The selected service type
    let service = parentDiv.find('.js-geona-explore-panel-content__service option:selected').text();
    // Whether to save the config to the cache folder
    let save = false;
    // Whether to load the config from the cache folder
    let useCache = false;
    if (parentDiv.find('.js-geona-explore-panel-content__cache-checkbox').prop('checked') ||
    parentDiv.find('.js-geona-explore-panel-content__cache-checkbox').hasClass('removed')) {
      save = true;
    } else {
      useCache = true;
    }
    eventManager.trigger('mainMenu.getLayerServer', [url, service, save, useCache]);
  });

  // Update text to use or refresh cache
  parentDiv.find('.js-geona-explore-panel-content__cache-checkbox').click(() => {
    let checked = parentDiv.find('.js-geona-explore-panel-content__cache-checkbox').prop('checked');
    if (checked === true) {
      eventManager.trigger('mainMenu.changeAddUrlButtonText', true);
    } else {
      eventManager.trigger('mainMenu.changeAddUrlButtonText', false);
    }
  });

  // Add URL layer to map
  parentDiv.find('.js-geona-explore-panel-content__add-layer').click(() => {
    let layerIdentifier = parentDiv.find('.js-geona-explore-panel-content__layer-select').val();
    eventManager.trigger('mainMenu.addUrlLayerToMap', layerIdentifier);
  });

  // Add available layer to map
  parentDiv.find('.js-geona-explore-panel-content__available-layers').change(() => {
    let option = parentDiv.find('.js-geona-explore-panel-content__available-layers').val();
    if (option !== 'geona-available-layers-title') {
      eventManager.trigger('mainMenu.addAvailableLayerToMap', option);
    }
  });
}

/**
 * Used by the main registerTriggers function to register triggers for
 * Layers panel elements which are not loaded at startup.
 * @param {EventManager} eventManager The event manager for the current instance of Geona.
 * @param {JQuery}       parentDiv    The div which contains the current map.
 */
function registerLayersTriggers(eventManager, parentDiv) {
  // Dragula reordering
  let dragger = dragula([parentDiv.find('.js-geona-layers-list')[0]],
    {
      moves: (item, container, handle) => {
        return handle.classList.contains('js-geona-layers-list__item-header');
      },
    });
  dragger.on('drop', (item) => {
    eventManager.trigger('mainMenu.reorderLayers', [item]);
  });

  // Show layer
  parentDiv.find('.js-geona-layers-list__item-header-icon-visibility-hiding').click((jQueryEvent) => {
    let item = jQueryEvent.target; // The HTML element which was clicked
    let identifier = $(jQueryEvent.target).closest('li')[0].dataset.identifier; // The layer id, stored in the dataset
    eventManager.trigger('mainMenu.showLayer', [identifier, item]);
  });

  // Hide layer
  parentDiv.find('.js-geona-layers-list__item-header-icon-visibility-showing').click((jQueryEvent) => {
    let item = jQueryEvent.target; // The HTML element which was clicked
    let identifier = $(jQueryEvent.target).closest('li')[0].dataset.identifier; // The layer id, stored in the dataset
    eventManager.trigger('mainMenu.hideLayer', [identifier, item]);
  });

  // Toggle settings panel
  parentDiv.find('.js-geona-layers-list__item-header-icon-settings').click((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    eventManager.trigger('mainMenu.toggleLayersPanelItemPanel', [item, 'settings']);
  });

  // Toggle info panel
  parentDiv.find('.js-geona-layers-list__item-header-icon-info').click((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    eventManager.trigger('mainMenu.toggleLayersPanelItemPanel', [item, 'info']);
  });

  // Toggle analysis panel
  parentDiv.find('.js-geona-layers-list__item-header-icon-analysis').click((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    eventManager.trigger('mainMenu.toggleLayersPanelItemPanel', [item, 'analysis']);
  });

  // Remove layer
  parentDiv.find('.js-geona-layers-list__item-header-icon-remove').click((jQueryEvent) => {
    // Finds the list element that contains the icon which was clicked
    let item = $(jQueryEvent.target).closest('li');
    eventManager.trigger('mainMenu.removeLayer', [item[0]]);
  });

  // Change layer opacity
  parentDiv.find('.js-geona-layers-list__item-body-settings-opacity-range').on('input', (jQueryEvent) => {
    let value = $(jQueryEvent.target).val();
    let item = $(jQueryEvent.target).closest('li')[0];
    eventManager.trigger('mainMenu.changeLayerOpacity', [item, value]);
  });

  // Change layer style
  parentDiv.find('.js-geona-layers-list__item-body-settings-styles-select').change((jQueryEvent) => {
    let item = $(jQueryEvent.target).closest('li')[0];
    let style = $(item).find('.js-geona-layers-list__item-body-settings-styles-select').val();
    eventManager.trigger('mainMenu.changeLayerStyle', [item, style]);
  });
}

/**
 * Used by the main registerTriggers function to register triggers for Options panel elements which are
 * not loaded at startup.
 * @param {EventManager} eventManager The event manager for the current instance of Geona.
 * @param {JQuery}       parentDiv    The div which contains the current map.
 */
function registerOptionsTriggers(eventManager, parentDiv) {
  // Select basemap
  parentDiv.find('.js-geona-options-panel-content__basemaps').change(function() {
    let option = parentDiv.find('.js-geona-options-panel-content__basemaps').val();
    eventManager.trigger('mainMenu.setBasemap', option);
  });
  // Select borders
  parentDiv.find('.js-geona-options-panel-content__borders').change(function() {
    let option = parentDiv.find('.js-geona-options-panel-content__borders option:selected').val();
    let style = parentDiv.find('.js-geona-options-panel-content__borders option:selected').data('style');
    eventManager.trigger('mainMenu.setBorders', [option, style]);
  });
  // Toggle graticule
  parentDiv.find('.js-geona-options-panel-content__graticule').click(function() {
    if (parentDiv.find('.js-geona-options-panel-content__graticule').prop('checked') === true) {
      eventManager.trigger('mainMenu.showGraticule');
    } else {
      eventManager.trigger('mainMenu.hideGraticule');
    }
  });
  // Select projection
  let previousProjection;
  let newProjection;
  parentDiv.find('.js-geona-options-panel-content__projection').focus(() => {
    previousProjection = parentDiv.find('.js-geona-options-panel-content__projection').val();
  }).change(() => {
    newProjection = parentDiv.find('.js-geona-options-panel-content__projection').val();
    eventManager.trigger('mainMenu.setProjection', [previousProjection, newProjection]);
  });
}
