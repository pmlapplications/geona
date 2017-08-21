import $ from 'jquery';

/**
 * Sets event triggers for main menu elements.
 */
export class MainMenuTriggers {
  /**
   *
   * @param {*} parentDiv The div which contains the map.
   */
  constructor(passedEventManager, parentDiv) {
    let eventManager = passedEventManager;
    this.setMenuExploreTriggers(parentDiv);
    this.setMenuLayersTriggers(parentDiv);
  }

  setMenuExploreTriggers(eventManager, parentDiv) {

  }

  setMenuLayersTriggers(eventManager, parentDiv) {
    parentDiv.find('.js-geona-sidebar__layers').click(() => {
      eventManager.trigger('appendLayersMenu');
    });
  }
}
