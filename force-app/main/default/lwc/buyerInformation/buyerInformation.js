import { LightningElement } from 'lwc';
import userId from '@salesforce/user/Id';
import getBuyerInfo from '@salesforce/apex/B2b_NewShippingAddress.getBuyerInfo';

export default class BuyerInformation extends LightningElement {
    buyerInfo
    connectedCallback(){
        getBuyerInfo({userId:userId
        }).then((result)=>{
            this.buyerInfo = result;
            console.log(result);
        }).catch((error)=>{
            console.log(error);
        });
    }
}