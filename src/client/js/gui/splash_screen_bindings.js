/**
 * Binds all the splash screen events to SplashScreen methods.
 * @param {EventManager} eventManager The EventManager for the current map.
 * @param {SplashScreen} splashScreen The splash screen.
 */
export function registerBindings(eventManager, splashScreen) {
  // Start new map
  eventManager.bind('startNewMap', () => {
    splashScreen.startNewMap();
  });
  // Load previous map
  eventManager.bind('loadPreviousMap', () => {
    splashScreen.loadPreviousMap();
  });
}
