export class TermsAndConditionsBindings {
  constructor(passedEventManager, parentDiv) {
    let eventManager = passedEventManager;
    let menu = mainMenu;
  }

  setMenuExploreBindings(eventManager, menu) {

  }

  setMenuLayersBindings(eventManager, menu) {
    eventManager.bind('appendLayersMenu', () => {
      menu.appendLayersMenu();
    });
  }
}
