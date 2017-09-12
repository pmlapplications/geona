/**
   * Sets the bindings for all menu-related events with the corresponding Menu methods.
   * @param {EventManager} eventManager The event manager for the current instance of Geona.
   * @param {Menu} menu The Menu object for the current instance of Geona.
   */
export function mainMenuBindings(eventManager, menu) {
  eventManager.bind('mainMenu.closePanel', () => {
    menu.closePanel();
  });
  eventManager.bind('mainMenu.openMenu', () => {
    menu.openMenu();
  });
  eventManager.bind('mainMenu.closeMenu', () => {
    menu.closeMenu();
  });

  /* ------------------------------------*\
      Explore Panel
  \* ------------------------------------*/
  eventManager.bind('mainMenu.displayExplorePanel', () => {
    menu.displayExplorePanel();
  });

  /* ------------------------------------*\
      Layers Panel
  \* ------------------------------------*/
  eventManager.bind('mainMenu.displayLayersPanel', () => {
    menu.displayLayersPanel();
  });


  /* ------------------------------------*\
      Analysis Panel
  \* ------------------------------------*/
  eventManager.bind('mainMenu.displayAnalysisPanel', () => {
    menu.displayAnalysisPanel();
  });


  /* ------------------------------------*\
      Login Panel
  \* ------------------------------------*/
  eventManager.bind('mainMenu.displayLoginPanel', () => {
    menu.displayLoginPanel();
  });


  /* ------------------------------------*\
      Help Panel
  \* ------------------------------------*/
  eventManager.bind('mainMenu.displayHelpPanel', () => {
    menu.displayHelpPanel();
  });


  /* ------------------------------------*\
      Share Panel
  \* ------------------------------------*/
  eventManager.bind('mainMenu.displaySharePanel', () => {
    menu.displaySharePanel();
  });
}
