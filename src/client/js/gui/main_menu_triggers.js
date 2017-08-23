import 'jquery';

/**
 * Sets event triggers for main menu elements.
 */
export class MainMenuTriggers {
  /**
   *
   * @param {*} parentDiv The div which contains the map.
   */
  constructor(eventManager, parentDiv) {
    this.setMenuExploreTriggers(eventManager, parentDiv);
    this.setMenuLayersTriggers(eventManager, parentDiv);
  }

  setMenuExploreTriggers(eventManager, parentDiv) {

  }

  setMenuLayersTriggers(eventManager, parentDiv) {
    parentDiv.find('.js-geona-sidebar__layers').click(() => {
      eventManager.trigger('appendLayersMenu');
    });
  }
}
