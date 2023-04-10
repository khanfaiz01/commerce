import { LightningElement, api } from 'lwc';

export default class CheckoutIndicator extends LightningElement {
  @api currentStep = 2;
  @api isStep1Complete = false;
  @api isStep2Complete = false;
  @api isStep3Complete = false;
  @api isStep4Complete = false;

  get step1Class() {
    return this.currentStep >= 1 ? 'slds-is-active' : '';
  }

  get step2Class() {
    return this.currentStep >= 2 ? 'slds-is-active' : '';
  }

  get step3Class() {
    return this.currentStep >= 3 ? 'slds-is-active' : '';
  }

  get step4Class() {
    return this.currentStep >= 4 ? 'slds-is-active' : '';
  }

  get step1Label() {
    return this.isStep1Complete ? 'Step 1 - Complete' : '1';
  }

  get step2Label() {
    return this.isStep2Complete ? 'Step 2 - Complete' : '2';
  }

  get step3Label() {
    return this.isStep3Complete ? 'Step 3 - Complete' : '3';
  }

  get step4Label() {
    return this.isStep4Complete ? 'Step 4 - Complete' : '4';
  }

  isStepDisabled(stepNumber) {
    return stepNumber > this.currentStep;
  }
}
