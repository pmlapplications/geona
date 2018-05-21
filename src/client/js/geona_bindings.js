export function registerBindings(geona) {
  let eventManager = geona.eventManager;
  eventManager.bind('geona.activatePeriodicStateSave', () => {
    geona.activatePeriodicStateSave();
  });
  // eventManager.trigger('geona.activatePeriodicStateSave');
}
