export class MainMenuBindings {
  constructor(passedEventManager, mainMenu) {
    this.eventManager = passedEventManager;
    this.menu = mainMenu;
  }

  setMenuExploreBindings(eventManager, menu) {

  }

  setMenuLayersBindings(eventManager, menu) {
    eventManager.bind('appendLayersMenu', () => {
      menu.appendLayersMenu();
    });
  }
}
