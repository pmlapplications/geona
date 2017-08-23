export function registerBindings(eventManager, termsAndConditions) {
  // Accept terms and conditions
  eventManager.bind('termsAndConditions.accept', () => {
    termsAndConditions.accept();
  });
}
