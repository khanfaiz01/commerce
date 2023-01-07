import { LightningElement,api, wire } from 'lwc';
import UId from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import insertCase from '@salesforce/apex/B2BGetInfo.insertCase';

export default class TestInventoryB2B extends LightningElement {
    Description = 'please notify when the product will be avaliable inStock';
    UserId = '005DS00000t0MsC';

    createProductCase(){
        insertCase({description:this.Description, userId:this.UserId})
        .then(result => {
            this.message = result;
            this.error = undefined;
            if(this.message !== undefined) {
                this.description = '';
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Case Submitted Succesfully, you will be notified when product is inStock',
                        variant: 'success',
                    }),
                );
            }
            
            console.log(JSON.stringify(result));
            console.log("result", this.message);
        })
        .catch(error => {
            this.message = undefined;
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Failed to Create the Case',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
            console.log("error", JSON.stringify(this.error));
        });

    }
}