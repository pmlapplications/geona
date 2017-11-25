import 'jquery';
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
    if (parentDiv.find('.js-geona-menu').hasClass('hidden')) {
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
    if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && lastTabClicked === 'js-geona-menu__explore') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayExplorePanel');
      // if (exploreTriggers === false) {
      registerExploreTriggers(eventManager, parentDiv);
      // exploreTriggers = true;
      // }
    }
    lastTabClicked = 'js-geona-menu__explore';
  });


  /* ------------------------------------*\
      Layers Panel
  \* ------------------------------------*/
  // Open/close panel
  parentDiv.find('.js-geona-menu__layers').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && lastTabClicked === 'js-geona-menu__layers') {
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
    if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && lastTabClicked === 'js-geona-menu__analysis') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayAnalysisPanel');
    }
    lastTabClicked = 'js-geona-menu__analysis';
  });

  /* ------------------------------------*\
      Login Panel
  \* ------------------------------------*/
  // Open/close panel
  parentDiv.find('.js-geona-menu__login').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && lastTabClicked === 'js-geona-menu__login') {
      eventManager.trigger('mainMenu.closePanel');
    } else {
      eventManager.trigger('mainMenu.displayLoginPanel');
    }
    lastTabClicked = 'js-geona-menu__login';
  });

  /* ------------------------------------*\
      Help Panel
  \* ------------------------------------*/
  // Open/close panel
  parentDiv.find('.js-geona-menu__help').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && lastTabClicked === 'js-geona-menu__help') {
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
    if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && lastTabClicked === 'js-geona-menu__share') {
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
  // Submit layer URL
  parentDiv.find('.js-geona-explore-panel-content__add-url').click(() => {
    // Check for service type
    let service = parentDiv.find('.js-geona-explore-panel-content__service option:selected').text();
    switch (service) {
      case 'WMS':
        eventManager.trigger('mainMenu.getLayersFromWms');
        break;
      case 'WMTS':
        eventManager.trigger('mainMenu.getLayersFromWmts');
        break;
    }
  });

  // Add URL layer to map
  parentDiv.find('.js-geona-explore-panel-content__add-layer').click(() => {
    eventManager.trigger('mainMenu.addUrlLayerToMap');
  });

  // Add available layer to map
  parentDiv.find('.js-geona-explore-panel-content__available-layers').change(() => {
    // console.log(parentDiv.find('js-geona-explore-panel-content__available-layers'));
    if (parentDiv.find('.js-geona-explore-panel-content__available-layers').val() !== 'geona-available-layers-title') {
      eventManager.trigger('mainMenu.addAvailableLayerToMap');
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
  let dragger = dragula([parentDiv.find('.js-geona-layers-list')[0]]);
  dragger.on('drop', (item) => {
    eventManager.trigger('mainMenu.reorderLayers', [item]);
  });

  // Show/hide layer
  // TODO why is 'this' invalid, and is there a better way to do it?
  parentDiv.find('.js-geona-layers-list__item-visibility').click(function() {
    // Finds the list element that contains the icon which was clicked
    let item = this.closest('li'); // eslint-disable-line no-invalid-this
    if (this.classList.contains('layer-hidden')) {// eslint-disable-line no-invalid-this
      eventManager.trigger('mainMenu.showLayer', [item]);
      this.classList.remove('layer-hidden');// eslint-disable-line no-invalid-this
    } else {
      eventManager.trigger('mainMenu.hideLayer', [item]);
      this.classList.add('layer-hidden');// eslint-disable-line no-invalid-this
    }
  });

  // Remove layer
  parentDiv.find('.js-geona-layers-list__item-remove').click(function() {
    // Finds the list element that contains the icon which was clicked
    let item = this.closest('li'); // eslint-disable-line no-invalid-this
    eventManager.trigger('mainMenu.removeLayer', [item]);
  });
}
