import { LightningElement,track, api } from 'lwc';
import UId from '@salesforce/user/Id';
import newShippingAddress from '@salesforce/apex/B2b_NewShippingAddress.newShippingAddress';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import  getShippingAddress from '@salesforce/apex/B2b_NewShippingAddress.getShippingAddress';
import  getcpaId from '@salesforce/apex/B2b_NewShippingAddress.getcpaId';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import  orderShippingAddress from '@salesforce/apex/B2b_NewShippingAddress.orderShippingAddress';


export default class B2bAddNewShippingAddress extends LightningElement {
    showModal = false;
    name;
    street;
    city;
    state;
    postalCode;
    country;
    UserId =UId;
    saveforfuture = false;
    isdefault = false;
    @api shippingInstruction;
    @api cartId;
    clickedNewAddress = false;

    value;
    options;
    ShippingValue = this.value;
    cpAddress;
    @api cpId;
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
                  label: r.Name ,
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
        this.cpAddress = event.target.options.find(opt => opt.value === event.detail.value).label;

        getcpaId({label : this.cpAddress})
        .then((result)=>
        {
            this.cpId = result;
            console.log(this.cpId);
        })
        this.dispatchEvent(new FlowAttributeChangeEvent('ContactPointAddressId', this.cpId));

    }
    handleCheck(event){
        this.saveforfuture = event.target.checked;
    }
    handleInstruction(event){
        this.shippingInstruction = event.target.value;
        this.dispatchEvent(new FlowAttributeChangeEvent('shippingInstruction', this.shippingInstruction));

    }
    handleDefault(event){
        this.isdefault = event.target.checked;
    }
    showModalBox(){  
        this.showModal = true;
        this.clickedNewAddress = true;
    }
    hideModalBox(){
        this.showModal = false;
        this.clickedNewAddress = false;
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
        if(this.saveforfuture){
        this.clickedNewAddress = false;
        newShippingAddress({name:this.name,street:this.street,city:this.city,state:this.state,
            postalCode:this.postalCode,country:this.country,userId:this.UserId,Isdef:this.isdefault})
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
    else{
        console.log(this.cartId);
        this.clickedNewAddress = true;
        orderShippingAddress({name:this.name,street:this.street,city:this.city,state:this.state,
            postalCode:this.postalCode,country:this.country,cartId:this.cartId})
        .then(result1 => {
            this.message = result1;
            this.value = result1;
            this.error = undefined;
            console.log('cartId : '+this.cartId)
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
                        message: 'New Address has been added to the CartDeliveryGroup successfully',
                        variant: 'success',
                    }),
                );
                this.showModal=false;
            }
            
            console.log(JSON.stringify(result1));
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
}