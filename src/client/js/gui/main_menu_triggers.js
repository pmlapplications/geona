import 'jquery';

/**
 * Sets event triggers for main menu elements.
 * @param {EventManager} eventManager The event manager for the current instance of Geona.
 * @param {JQuery}       parentDiv    The div which contains the current map.
 */
export function registerTriggers(eventManager, parentDiv) {
  let lastTabClicked = '';

  // Open/close menu
  parentDiv.find('.js-geona-menu-toggle').click(() => {
    if (parentDiv.find('.js-geona-menu').hasClass('hidden')) {
      eventManager.trigger('mainMenu.openMenu');
    } else {
      eventManager.trigger('mainMenu.closeMenu');
    }
  });

  /* ------------------------------------*\
      Explore Panel
  \* ------------------------------------*/
  // Open/close panel
  parentDiv.find('.js-geona-menu__explore').click(() => {
    if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && lastTabClicked === 'js-geona-menu__explore') {
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
    if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && lastTabClicked === 'js-geona-menu__layers') {
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
    console.log('service: ' + service);
    switch (service) {
      case 'WMS':
        eventManager.trigger('mainMenu.getLayersFromWMS');
        console.log('wms trigger');
        break;
      case 'WMTS':
        eventManager.trigger('mainMenu.getLayersFromWMTS');
        console.log('wmts trigger');
        break;
    }
  });

  // Add layer to map
  parentDiv.find('.js-geona-explore-panel-content__add-layer').click(() => {
    eventManager.trigger('mainMenu.addUrlLayerToMap');
  });
}
