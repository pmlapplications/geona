/**
 * Binds the events relating to the timePanel to TimePanel methods.
 * @param {EventManager} eventManager   The event manager for this instance of Geona.
 * @param {TermsAndConditions} timePanel The TimePanel object for the current map.
 */
export function registerBindings(eventManager, timePanel) {
  // Load timePanel (trigger set in map classes)
  eventManager.bind('map.initialized', () => {
    timePanel.drawTimebar();
  });

  // Show timePanel
  eventManager.bind('timePanel.showTimeline', () => {
    timePanel.showTimeline();
  });
  // Hide timePanel
  eventManager.bind('timePanel.hideTimeline', () => {
    timePanel.hideTimeline();
  });

  // Show pikaday
  eventManager.bind('timePanel.showPikaday', () => {
    timePanel.showPikaday();
  });
  // Hide pikaday
  eventManager.bind('timePanel.hidePikaday', () => {
    timePanel.hidePikaday();
  });
}
