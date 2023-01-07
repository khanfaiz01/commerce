import { LightningElement, wire } from 'lwc';
import  getBillingAddress from '@salesforce/apex/B2b_NewShippingAddress.getBillingAddress';
import UId from '@salesforce/user/Id';

export default class ShowBillingAddress extends LightningElement {
    userId =  UId;//'005DS00000t0MsC';
    value;
    options;
    connectedCallback(){
        this.getOptions();
    }

    getOptions() {
        getBillingAddress({userId:this.userId})
          .then((result) => {
             let options = [];
            if (result) {
              result.forEach(r => {
                options.push({
                  label: r.City,
                  value: r.Name+', '+r.City+', '+r.State+', '+r.PostalCode+', '+r.Country,
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
    

    
}