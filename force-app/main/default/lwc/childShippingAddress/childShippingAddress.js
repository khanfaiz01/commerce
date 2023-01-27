import { LightningElement,api } from 'lwc';

export default class ChidlShippingAddress extends LightningElement {
    @api billingValue;
    @api shippingValue;

    @api cartShipping;
    @api cartBilling;

    connectedCallback(){
        
    }
}