export function registerBindings(eventManager, termsAndConditions) {
  // Accept terms and conditions
  eventManager.bind('timeline.showTimeline', () => {
    termsAndConditions.showTimeline();
  });
}
