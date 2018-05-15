/**
 * Binds the events relating to the timePanel to TimePanel methods.
 * @param {EventManager} eventManager The event manager for this instance of Geona.
 * @param {Lmap}         mapLeaflet   The Leaflet Geona map instance.
 */
export function registerBindings(eventManager, mapLeaflet) {
  // Adjust attribution height for this map (trigger set in Timeline class)
  eventManager.bind('timePanel.heightChanged', () => {
    mapLeaflet.adjustAttributionHeight();
  });
  eventManager.bind('mapLeaflet.updateConfig', () => {
    mapLeaflet.updateConfig();
  });
}
