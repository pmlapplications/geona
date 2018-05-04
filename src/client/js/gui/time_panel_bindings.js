/**
 * Binds the events relating to the timePanel to TimePanel methods.
 * @param {EventManager} eventManager   The event manager for this instance of Geona.
 * @param {TimePanel} timePanel The TimePanel object for the current map.
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
  // Show timePanel toggle control
  eventManager.bind('timePanel.showTimePanelToggleControl', () => {
    timePanel.showTimePanel();
  });
  // Hide timePanel toggle control
  eventManager.bind('timePanel.hideTimePanelToggleControl', () => {
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

  // Update pikaday range
  eventManager.bind('timePanel.setPikadayRange', ([startDate, endDate]) => {
    timePanel.setPikadayRange(startDate, endDate);
  });

  // Change the non-timeline elements
  eventManager.bind('timePanel.timelineChangeTime', (time) => {
    timePanel.timelineChangeTime(time);
  });

  // Update the pikaday display
  eventManager.bind('timePanel.pikadayUpdateGraphic', (time) => {
    timePanel.pikadayUpdateGraphic(time);
  });

  // Show the tooltip for prev/next steps
  eventManager.bind('timePanel.stepPreviewTime', (step) => {
    timePanel.stepPreviewTime(step);
  });

  // Change the map layers and other elements, triggered by the steps
  eventManager.bind('timePanel.stepChangeTime', (step) => {
    timePanel.stepChangeTime(step);
  });

  // Bindings for time panel
  let activeDataLayers = timePanel.geona.map.config.data;
  // Add layer from URL
  eventManager.bind('mainMenu.addUrlLayerToMap', () => { // FIXME logic is wrong, I think activeDataLayers has a race condition where it will be 1
    if (!timePanel.config.openedWithNoLayers && activeDataLayers.length === 0 && timePanel.config.allowToggle) { // fixme use config.timeline.openOnLayerLoad
      timePanel.showTimePanel();

      if (!timePanel.config.allowToggleWithNoLayers) {
        timePanel.showTimePanelToggleControl();
      }
    }
  });
  // Add layer from available layers
  eventManager.bind('mainMenu.addAvailableLayerToMap', () => {
    if (!timePanel.config.openedWithNoLayers && activeDataLayers.length === 0 && timePanel.config.allowToggle) {
      timePanel.showTimePanel();

      if (!timePanel.config.allowToggleWithNoLayers) {
        timePanel.showTimePanelToggleControl();
      }
    }
  });
  // Remove layer
  eventManager.bind('mainMenu.removeLayer', () => {
    if (!timePanel.config.openedWithNoLayers && activeDataLayers.length === 1 && timePanel.config.allowToggle) {
      timePanel.hideTimePanel();

      if (!timePanel.config.allowToggleWithNoLayers) {
        timePanel.hideTimePanelToggleControl();
      }
    }
  });
}
