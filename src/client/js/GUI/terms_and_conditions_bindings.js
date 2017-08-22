export class TermsAndConditionsBindings {
  constructor(eventManager, termsAndConditionsInstance) {
    // Accept terms and conditions
    eventManager.bind('acceptTermsAndConditions', () => {
      termsAndConditionsInstance.acceptTermsAndConditions();
    });
  }
}
