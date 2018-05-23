export function registerTriggers(eventManager, geonaDiv, openLayersMap) {
  openLayersMap.getView().on('change', () => {
    eventManager.trigger('mapOpenlayers.updateConfig');
  });
}
