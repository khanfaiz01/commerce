import { LightningElement,track,api } from 'lwc';
import {FlowAttributeChangeEvent,FlowNavigationNextEvent} from 'lightning/flowSupport';

export default class B2B_Flow_Navigation extends LightningElement {

    @api isBack = false;
    @api cartId;
    @api availableActions=[];



    connectedCallback(){
        this.isBack = false;
        console.log(this.availableActions);
    }
    handleNext() {
        console.log(this.availableActions);
        if (this.availableActions.find((action) => action === "NEXT")) {
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
        }
    }
    handleBack() {
        this.isBack = true;
        this.dispatchEvent(new FlowAttributeChangeEvent('isBack', this.isBack));
        this.handleNext();
   }
}