/**
 * Binds the events relating to the timeline to Timebar methods.
 * @param {EventManager} eventManager   The event manager for this instance of Geona.
 * @param {TermsAndConditions} timeline The Timeline object for the current map.
 */
export function registerBindings(eventManager, timeline) {
  // Change time
  eventManager.bind('timeline.timebarTriggeredChangeTime', (time) => {
    timeline.timebarTriggeredChangeTime(time);
  });
}
