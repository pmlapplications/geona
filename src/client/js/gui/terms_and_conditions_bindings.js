/**
 * Sets the bindings for events relating to the terms and conditions screen.
 * @param {EventManager} eventManager The EventManager for the current map.
 * @param {TermsAndConditions} termsAndConditions The TermsAndConditions object for the current map.
 */
export function registerBindings(eventManager, termsAndConditions) {
  // Accept terms and conditions
  eventManager.bind('termsAndConditions.accept', () => {
    termsAndConditions.accept();
  });
}
