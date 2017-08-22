/**
 * 
 */
export class OverlayBindings {
  /**
   * 
   *
   * @param {EventManager} eventManager The EventManager for the current map.
   * @param {Overlay} overlayInstance The Overlay parent object.
   */
  constructor(eventManager, overlayInstance) {
    // Start new map
    eventManager.bind('startNewMap', () => {
      overlayInstance.startNewMap();
    });
    // Load previous map
    eventManager.bind('loadPreviousMap', () => {
      overlayInstance.loadPreviousMap();
    });
  }
}
