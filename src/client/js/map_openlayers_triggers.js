export function registerTriggers(eventManager, geonaDiv, openLayersMap) {
  openLayersMap.getView().on('change', () => {
    console.log('map changed');
    eventManager.trigger('mapOpenlayers.updateConfig');
  });
}
