/**
 * Binds the events relating to the timePanel to Timebar methods.
 * @param {EventManager} eventManager   The event manager for this instance of Geona.
 * @param {TimePanel} timePanel The TimePanel object for the current map.
 */
export function registerBindings(eventManager, timePanel) {
  // Change time
  eventManager.bind('timePanel.timelineChangeTime', (time) => {
    timePanel.timelineChangeTime(time);
  });
  eventManager.bind('mainMenu.addUrlLayerToMap', (layerIdentifier) => {
    let layer = timePanel.geona.map._availableLayers[layerIdentifier];
    timePanel.timeline.addTimelineLayer(layer);
  });
  eventManager.bind('mainMenu.addAvailableLayerToMap', (layerIdentifier) => {
    let layer = timePanel.geona.map._availableLayers[layerIdentifier];
    timePanel.timeline.addTimelineLayer(layer);
  });
  eventManager.bind('mainMenu.removeLayer', (item) => {
    let layerIdentifier = item[0].dataset.identifier;
    timePanel.timeline.removeTimelineLayer(layerIdentifier);
  });
}
