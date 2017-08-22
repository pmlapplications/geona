export class MainMenuBindings {
  constructor(passedEventManager, mainMenu) {
    this.setMenuExploreBindings(passedEventManager, mainMenu);
    this.setMenuLayersBindings(passedEventManager, mainMenu);
  }

  setMenuExploreBindings(eventManager, menu) {

  }

  setMenuLayersBindings(eventManager, menu) {
    eventManager.bind('appendLayersMenu', () => {
      menu.appendLayersMenu();
    });
  }
}
