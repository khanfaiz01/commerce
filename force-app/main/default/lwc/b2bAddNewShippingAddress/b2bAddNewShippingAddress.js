import { LightningElement,track } from 'lwc';
import UId from '@salesforce/user/Id';
import newShippingAddress from '@salesforce/apex/B2b_NewShippingAddress.newShippingAddress';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import  getShippingAddress from '@salesforce/apex/B2b_NewShippingAddress.getShippingAddress';

export default class B2bAddNewShippingAddress extends LightningElement {
    showModal = false;
    name;
    street;
    city;
    state;
    postalCode;
    country;
    UserId =UId;

    value;
    options;
    connectedCallback(){
        this.getOptions();
    }
    getOptions() {
        getShippingAddress({userId:this.UserId})
          .then((result) => {
             let options = [];
            if (result) {
              result.forEach(r => {
                options.push({
                  label: r.Name,
                  value: r.Name+', '+r.Street+', '+r.City+', '+r.State+', '+r.PostalCode+', '+r.Country,
                });
              });
            }
            this.options = options;
          })
          .catch((error) => {
            // handle Error
            console.log(error);
          });
      }

    handleChange(event) {
        this.value = event.detail.value;
    }

    showModalBox(){  
        this.showModal = true;
    }
    hideModalBox(){
        this.showModal = false;
    }
    nameChange(event){
        this.name = event.target.value;
    }
    streetChange(event){
        this.street = event.target.value;
    }
    cityChange(event){
        this.city = event.target.value;
    }
    stateChange(event){
        this.state = event.target.value;
    }
    postalCodeChange(event){
        this.postalCode = event.target.value;
    }
    countryChange(event){
        this.country = event.target.value;
    }

    addNewAddress(){
        newShippingAddress({name:this.name,street:this.street,city:this.city,state:this.state,
            postalCode:this.postalCode,country:this.country,userId:this.UserId})
        .then(result => {
            this.message = result;
            this.error = undefined;
            if(this.message !== undefined) {
                this.name='';
                this.street='';
                this.city='';
                this.state = '';
                this.postalCode='';
                this.country='';
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'New Address Added to the account record successfully',
                        variant: 'success',
                    }),
                );
                this.showModal=false;
                window.location.reload()
            }
            
            console.log(JSON.stringify(result));
            console.log("result", this.message);
        })
        .catch(error => {
            this.message = undefined;
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Failed to Save the Address',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
            console.log("error", JSON.stringify(this.error));
        });

}
}