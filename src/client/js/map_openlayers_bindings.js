/**
 * Binds the events relating to the timePanel to TimePanel methods.
 * @param {EventManager} eventManager   The event manager for this instance of Geona.
 */
export function registerBindings(eventManager, mapOpenLayers) {
  // Adjust attribution height for this map (trigger set in Timeline class)
  eventManager.bind('timePanel.heightChanged', () => {
    mapOpenLayers.adjustAttributionHeight();
  });
  eventManager.bind('mapOpenlayers.updateConfig', () => {
    mapOpenLayers.updateConfig();
  });
}
