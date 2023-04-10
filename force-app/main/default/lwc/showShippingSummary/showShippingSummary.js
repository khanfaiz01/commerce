import { LightningElement,track,api } from 'lwc';
import getShip from '@salesforce/apex/B2b_NewShippingAddress.getShip';
import orderShippingAddress from '@salesforce/apex/B2b_NewShippingAddress.orderShippingAddress';

export default class ShowShippingSummary extends LightningElement {
    @track shippingAddress;
    @api cartId;
    @track data={};
    connectedCallback(){
        getShip({cartId:this.cartId
        }).then((result)=>{
            this.data = result
        })
    }
    
}