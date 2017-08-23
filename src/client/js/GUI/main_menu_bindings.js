export class MainMenuBindings {
  constructor(eventManager, mainMenu) {
    this.setMenuExploreBindings(eventManager, mainMenu);
    this.setMenuLayersBindings(eventManager, mainMenu);
  }

  setMenuExploreBindings(eventManager, menu) {

  }

  setMenuLayersBindings(eventManager, menu) {
    eventManager.bind('appendLayersMenu', () => {
      menu.appendLayersMenu();
    });
  }
}
