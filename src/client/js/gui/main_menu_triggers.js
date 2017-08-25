import $ from 'jquery';

/**
 * Sets event triggers for main menu elements.
 */
export class MainMenuTriggers {
  /**
   *
   * @param {*} parentDiv The div which contains the map.
   */
  constructor(eventManager, parentDiv) {
    this.lastTabClicked = '';

    // Open/close menu
    parentDiv.find('.js-geona-menu-toggle').click(() => {
      if (parentDiv.find('.js-geona-menu').hasClass('hidden')) {
        eventManager.trigger('mainMenu.openMenu');
      } else {
        eventManager.trigger('mainMenu.closeMenu');
      }
    });

    this.setMenuExploreTriggers(eventManager, parentDiv);
    this.setMenuLayersTriggers(eventManager, parentDiv);
    this.setMenuAnalysisTriggers(eventManager, parentDiv);
    this.setMenuLoginTriggers(eventManager, parentDiv);
    this.setMenuHelpTriggers(eventManager, parentDiv);
    this.setMenuShareTriggers(eventManager, parentDiv);
  }

  setMenuExploreTriggers(eventManager, parentDiv) {
    // Open/close panel
    parentDiv.find('.js-geona-menu__explore').click(() => {
      if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && this.lastTabClicked === 'js-geona-menu__explore') {
        eventManager.trigger('mainMenu.closePanel');
      } else {
        eventManager.trigger('mainMenu.displayExplorePanel');
      }
      this.lastTabClicked = 'js-geona-menu__explore';
    });
  }

  /**
   * Checks to see if the layers information should be closed or opened.
   * - if opened, gives event to populate panel.
   * - if closed, gived event to close panel.
   * @param {*} eventManager
   * @param {*} parentDiv
   */
  setMenuLayersTriggers(eventManager, parentDiv) {
    // Open/close panel
    parentDiv.find('.js-geona-menu__layers').click(() => {
      if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && this.lastTabClicked === 'js-geona-menu__layers') {
        eventManager.trigger('mainMenu.closePanel');
      } else {
        eventManager.trigger('mainMenu.displayLayersPanel');
      }
      this.lastTabClicked = 'js-geona-menu__layers';
    });
  }

  setMenuAnalysisTriggers(eventManager, parentDiv) {
    // Open/close panel
    parentDiv.find('.js-geona-menu__analysis').click(() => {
      if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && this.lastTabClicked === 'js-geona-menu__analysis') {
        eventManager.trigger('mainMenu.closePanel');
      } else {
        eventManager.trigger('mainMenu.displayAnalysisPanel');
      }
      this.lastTabClicked = 'js-geona-menu__analysis';
    });
  }

  setMenuLoginTriggers(eventManager, parentDiv) {
    // Open/close panel
    parentDiv.find('.js-geona-menu__login').click(() => {
      if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && this.lastTabClicked === 'js-geona-menu__login') {
        eventManager.trigger('mainMenu.closePanel');
      } else {
        eventManager.trigger('mainMenu.displayLoginPanel');
      }
      this.lastTabClicked = 'js-geona-menu__login';
    });
  }

  setMenuHelpTriggers(eventManager, parentDiv) {
    // Open/close panel
    parentDiv.find('.js-geona-menu__help').click(() => {
      if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && this.lastTabClicked === 'js-geona-menu__help') {
        eventManager.trigger('mainMenu.closePanel');
      } else {
        eventManager.trigger('mainMenu.displayHelpPanel');
      }
      this.lastTabClicked = 'js-geona-menu__help';
    });
  }

  setMenuShareTriggers(eventManager, parentDiv) {
    // Open/close panel
    parentDiv.find('.js-geona-menu__share').click(() => {
      if (!parentDiv.find('.js-geona-panel').hasClass('hidden') && this.lastTabClicked === 'js-geona-menu__share') {
        eventManager.trigger('mainMenu.closePanel');
      } else {
        eventManager.trigger('mainMenu.displaySharePanel');
      }
      this.lastTabClicked = 'js-geona-menu__share';
    });
  }
}
