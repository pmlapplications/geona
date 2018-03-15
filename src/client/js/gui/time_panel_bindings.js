/**
 * Binds the events relating to the timePanel to TimePanel methods.
 * @param {EventManager} eventManager   The event manager for this instance of Geona.
 * @param {TermsAndConditions} timePanel The TimePanel object for the current map.
 */
export function registerBindings(eventManager, timePanel) {
  // Load timePanel (trigger set in Geona class)
  eventManager.bind('map.initialized', () => {
    timePanel.drawTimeline();
  });

  // Show timePanel
  eventManager.bind('timePanel.showTimePanel', () => {
    timePanel.showTimePanel();
  });
  // Hide timePanel
  eventManager.bind('timePanel.hideTimePanel', () => {
    timePanel.hideTimePanel();
  });

  // Show pikaday
  eventManager.bind('timePanel.showPikaday', () => {
    timePanel.showPikaday();
  });
  // Hide pikaday
  eventManager.bind('timePanel.hidePikaday', () => {
    timePanel.hidePikaday();
  });

  // Change the non-timeline elements
  eventManager.bind('timePanel.timelineChangeTime', (time) => {
    timePanel.timelineChangeTime(time);
  });

  // Update the pikaday display
  eventManager.bind('timePanel.pikadayUpdateGraphic', (time) => {
    timePanel.pikadayUpdateGraphic(time);
  });

  // Show the tooltip for prev/next buttons
  eventManager.bind('timePanel.buttonPreviewTime', (button) => {
    timePanel.buttonPreviewTime(button);
  });

  // Change the map layers and other elements, triggered by the buttons
  eventManager.bind('timePanel.buttonChangeTime', (button) => {
    timePanel.buttonChangeTime(button);
  });
}
