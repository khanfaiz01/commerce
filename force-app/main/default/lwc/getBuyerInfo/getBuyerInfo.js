import { LightningElement,track } from 'lwc';
import uId from '@salesforce/user/Id';
import getBuyerInfo from '@salesforce/apex/B2b_NewShippingAddress.getBuyerInfo';

export default class BuyerInformation extends LightningElement {
    @track buyerInfo={};
    @track userId = uId;
    connectedCallback(){
        getBuyerInfo({UserId:this.userId
        })
        .then((result)=>{
            this.buyerInfo = result
        }).catch((error)=>{
            console.log(error);
        });
    }
}