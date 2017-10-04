/**
   * Sets the bindings for all menu-related events with the corresponding Menu methods.
   * @param {EventManager} eventManager The event manager for the current instance of Geona.
   * @param {MainMenu} menu The MainMenu object for the current instance of Geona.
   */
export function registerBindings(eventManager, menu) {
  // Close panel
  eventManager.bind('mainMenu.closePanel', () => {
    menu.closePanel();
  });
  // Open menu
  eventManager.bind('mainMenu.openMenu', () => {
    menu.openMenu();
  });
  // Close menu
  eventManager.bind('mainMenu.closeMenu', () => {
    menu.closeMenu();
  });


  /*
   * Explore Panel
   */
  // Display explore panel
  eventManager.bind('mainMenu.displayExplorePanel', () => {
    menu.displayExplorePanel();
  });
  // Submit WMS URL
  eventManager.bind('mainMenu.getLayersFromWMS', () => {
    menu.getLayersFromWMS();
  });
  // Submit WMTS URL
  eventManager.bind('mainMenu.getLayersFromWMTS', () => {
    menu.getLayersFromWMTS();
  });
  // Add layer from URL to map
  eventManager.bind('mainMenu.addUrlLayerToMap', () => {
    menu.addUrlLayerToMap();
  });


  /*
   * Layers Panel
   */
  eventManager.bind('mainMenu.displayLayersPanel', () => {
    menu.displayLayersPanel();
  });


  /*
   * Analysis Panel
   */
  eventManager.bind('mainMenu.displayAnalysisPanel', () => {
    menu.displayAnalysisPanel();
  });


  /*
   * Login Panel
   */
  eventManager.bind('mainMenu.displayLoginPanel', () => {
    menu.displayLoginPanel();
  });


  /*
   * Help Panel
   */
  eventManager.bind('mainMenu.displayHelpPanel', () => {
    menu.displayHelpPanel();
  });


  /*
   * Share Panel
   */
  eventManager.bind('mainMenu.displaySharePanel', () => {
    menu.displaySharePanel();
  });
}
