import { LightningElement,api,track} from 'lwc';
import getCartBillingAddrs from '@salesforce/apex/B2b_NewShippingAddress.getCartBillingAddrs';

export default class GetBillingAtSummary extends LightningElement {
    @api cartId;
    @track getBillingAddress={};
    connectedCallback(){
        getCartBillingAddrs({cartId:this.cartId
        }).then((result)=>{
            this.getBillingAddress = result;
            console.log(this.getBillingAddress);
        })
        .catch((error)=>{
            console.log(error);
        })
        console.log(getCartBillingAddrs);
    }

}