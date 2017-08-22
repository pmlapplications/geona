export class TermsAndConditionsBindings {
  constructor(passedEventManager, termsAndConditionsInstance) {
    this.setTermsAndConditionsAcceptBinding(passedEventManager, termsAndConditionsInstance);
  }

  setTermsAndConditionsAcceptBinding(eventManager, termsAndConditionsInstance) {
    console.log(termsAndConditionsInstance);
    eventManager.bind('acceptTermsAndConditions', () => {
      termsAndConditionsInstance.acceptTermsAndConditions();
    });
  }
}
