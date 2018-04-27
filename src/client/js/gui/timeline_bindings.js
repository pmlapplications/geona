/**
 * Binds the events relating to the timePanel to Timebar methods.
 * @param {EventManager} eventManager The event manager for this instance of Geona.
 * @param {Timeline}     timeline     The Timeline class for the current map.
 */
export function registerBindings(eventManager, timeline) {
  // Add layer from URL
  eventManager.bind('mainMenu.addUrlLayerToMap', (layerIdentifier) => {
    let layer = timeline.geona.map.availableLayers[layerIdentifier];
    timeline.addTimelineLayer(layer);
  });
  // Add layer from available layers
  eventManager.bind('mainMenu.addAvailableLayerToMap', (layerIdentifier) => {
    let layer = timeline.geona.map.availableLayers[layerIdentifier];
    timeline.addTimelineLayer(layer);
  });
  // Remove layer
  eventManager.bind('mainMenu.removeLayer', (item) => {
    let layerIdentifier = item[0].dataset.identifier;
    timeline.removeTimelineLayer(layerIdentifier);
  });
}
