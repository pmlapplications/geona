export class MainMenuBindings {
  constructor(eventManager, menu) {
    this.setMenuExploreBindings(eventManager, menu);
    this.setMenuLayersBindings(eventManager, menu);
    this.setMenuAnalysisBindings(eventManager, menu);
    this.setMenuLoginBindings(eventManager, menu);
    this.setMenuHelpBindings(eventManager, menu);
    this.setMenuShareBindings(eventManager, menu);

    eventManager.bind('mainMenu.closePanel', () => {
      menu.closePanel();
    });
    eventManager.bind('mainMenu.openMenu', () => {
      menu.openMenu();
    });
    eventManager.bind('mainMenu.closeMenu', () => {
      menu.closeMenu();
    });
  }

  setMenuExploreBindings(eventManager, menu) {
    eventManager.bind('mainMenu.displayExplorePanel', () => {
      menu.displayExplorePanel();
    });
  }

  setMenuLayersBindings(eventManager, menu) {
    eventManager.bind('mainMenu.displayLayersPanel', () => {
      menu.displayLayersPanel();
    });
  }

  setMenuAnalysisBindings(eventManager, menu) {
    eventManager.bind('mainMenu.displayAnalysisPanel', () => {
      menu.displayAnalysisPanel();
    });
  }

  setMenuLoginBindings(eventManager, menu) {
    eventManager.bind('mainMenu.displayLoginPanel', () => {
      menu.displayLoginPanel();
    });
  }

  setMenuHelpBindings(eventManager, menu) {
    eventManager.bind('mainMenu.displayHelpPanel', () => {
      menu.displayHelpPanel();
    });
  }

  setMenuShareBindings(eventManager, menu) {
    eventManager.bind('mainMenu.displaySharePanel', () => {
      menu.displaySharePanel();
    });
  }
}
