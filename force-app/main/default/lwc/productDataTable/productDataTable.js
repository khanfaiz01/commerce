import { LightningElement,api,track } from 'lwc';
import getcartItems from '@salesforce/apex/B2B_NewShippingAddress.getcartItems';
export default class ProductDateTable extends LightningElement {
    @api cartId;
    @track data;
    connectedCallback() {
        getcartItems({cartId:this.cartId
        }).then((result)=>{
            
                this.data = result;
                console.log('this is data :'+this.data);
            
        })
    }
}
