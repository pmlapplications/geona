/**
 * Binds the events relating to the timeline to Timeline methods.
 * @param {EventManager} eventManager   The event manager for this instance of Geona.
 * @param {TermsAndConditions} timeline The Timeline object for the current map.
 */
export function registerBindings(eventManager, timeline) {
  // Load timeline (trigger set in map classes)
  eventManager.bind('map.initialized', () => {
    timeline.drawTimebar();
  });

  // Show timeline
  eventManager.bind('timeline.showTimeline', () => {
    timeline.showTimeline();
  });
  // Hide timeline
  eventManager.bind('timeline.hideTimeline', () => {
    timeline.hideTimeline();
  });

  // Show pikaday
  eventManager.bind('timeline.showPikaday', () => {
    timeline.showPikaday();
  });
  // Hide pikaday
  eventManager.bind('timeline.hidePikaday', () => {
    timeline.hidePikaday();
  });
}
