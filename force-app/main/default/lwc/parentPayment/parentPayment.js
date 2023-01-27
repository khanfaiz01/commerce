import { LightningElement,track,api,wire } from 'lwc';
import UID from '@salesforce/user/Id';
import getPoNumber from '@salesforce/apex/B2bPOchck.getPoNumber';

export default class ParentPayment extends LightningElement {
    @track userId = UID; // getting the userId from the Commerce;
    @track POCheck;
    @api cartId;

    connectedCallback(){
        getPoNumber({UserId:this.userId
        }).then((res)=>{
            this.POCheck = res;
            console.log('check component :'+this.POCheck);
        })
        .catch((error)=>{
            console.log(error);
        })
        console.log(this.userId);
    }
}