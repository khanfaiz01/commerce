// Import LightningElement and api classes from lwc module
import { LightningElement, api, wire, track } from "lwc";

//import cancelCheckout from "@salesforce/apex/B2B_CheckoutController.cancelCheckout";

export default class B2b_checkOutSteps extends LightningElement {
  @api currentState;
  @api cartId;
  steps = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
  ];
  shipping = false;
  get _shipping() {
    if (currentState == "shipping") {
      this.shipping = true;
    }
    return this.shipping;
  }

  // disconnectedCallback() {
  //   cancelCheckout({ cartId: this.cartId });
  // }

  connectedCallback() {}
  renderedCallback() {
    console.log(this.currentState);
    //var cur = "3";
    this.initCSSVariables();
    if (this.currentState == "1") {
      this.template.querySelector('[data-id="1"]').className =
        "slider-circle-orange-border";
      this.template.querySelector('[data-id="2"]').className =
        " slider-circle-gray";
      this.template.querySelector('[data-id="3"]').className =
        " slider-circle-gray";
      this.template.querySelector('[data-id="4"]').className =
        " slider-circle-gray";
    }
    if (this.currentState == "2") {
      this.template.querySelector('[data-id="1"]').className =
        "slider-circle-orange";
      this.template.querySelector('[data-id="2"]').className =
        " slider-circle-orange-border";
      this.template.querySelector('[data-id="3"]').className =
        " slider-circle-gray";
      this.template.querySelector('[data-id="4"]').className =
        " slider-circle-gray";
    }
    if (this.currentState == "3") {
      this.template.querySelector('[data-id="1"]').className =
        "slider-circle-orange";
      this.template.querySelector('[data-id="2"]').className =
        " slider-circle-orange";
      this.template.querySelector('[data-id="3"]').className =
        " slider-circle-orange-border";
      this.template.querySelector('[data-id="4"]').className =
        " slider-circle-gray";
    }
    if (this.currentState == "4") {
      this.template.querySelector('[data-id="1"]').className =
        "slider-circle-orange";
      this.template.querySelector('[data-id="2"]').className =
        " slider-circle-orange";
      this.template.querySelector('[data-id="3"]').className =
        " slider-circle-orange";
      this.template.querySelector('[data-id="4"]').className =
        " slider-circle-orange-border";
    }
  }
  initCSSVariables() {
    var css = document.body.style;
    var wid = 100;
    if (this.currentState == "1") {
      wid = 100;
    }
    if (this.currentState == "2") {
      wid = 200;
    }
    if (this.currentState == "3") {
      wid = 300;
    }
    if (this.currentState == "4") {
      wid = 400;
    }
    css.setProperty("--modalWidth", wid);
  }
}