export function registerTriggers(eventManager, geonaDiv, leafletMap) {
  leafletMap.on('zoomend', () => {
    eventManager.trigger('mapLeaflet.updateConfig');
  });
  leafletMap.on('moveend', () => {
    eventManager.trigger('mapLeaflet.updateConfig');
  });
}
