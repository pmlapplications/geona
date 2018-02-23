/**
 * Binds the events relating to the timePanel to Timebar methods.
 * @param {EventManager} eventManager   The event manager for this instance of Geona.
 * @param {TermsAndConditions} timePanel The TimePanel object for the current map.
 */
export function registerBindings(eventManager, timePanel) {
  // Change time
  eventManager.bind('timePanel.timelineChangeTime', (time) => {
    timePanel.timelineChangeTime(time);
  });
}
