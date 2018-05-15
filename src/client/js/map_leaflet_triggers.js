export function registerTriggers(eventManager, geonaDiv, leafletMap) {
  leafletMap.on('zoomend', () => {
    console.log('map changed');
    eventManager.trigger('mapLeaflet.updateConfig');
  });
  leafletMap.on('moveend', () => {
    console.log('map changed');
    eventManager.trigger('mapLeaflet.updateConfig');
  });
}
