import { LightningElement, wire,api } from 'lwc';
import  getBillingAddress from '@salesforce/apex/B2b_NewShippingAddress.getBillingAddress';
import UId from '@salesforce/user/Id';
import  getcpaId from '@salesforce/apex/B2b_NewShippingAddress.getcpaId';
import  updateCartBilling from '@salesforce/apex/B2b_NewShippingAddress.updateCartBilling';

export default class ShowBillingAddress extends LightningElement {
    userId =  UId;//'005DS00000t0MsC';
    value;
    options;
    cpBillingLabel;
    @api cpLabelId;
    @api cartId;

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
                  label: r.Name,
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
        this.cpBillingLabel = event.target.options.find(opt => opt.value === event.detail.value).label;
        console.log(this.value);
        getcpaId({
          label : this.cpBillingLabel
        }).then((result)=>
        {
            this.cpLabelId = result;
            console.log('cartId :'+this.cartId);
            updateCartBilling({
              BillingId:this.cpLabelId, 
              CartId:this.cartId
            }).then((res)=>{
              console.log('inside'+res);
            })
            .catch(err => {
              console.log('get error :'+ JSON.stringify(err));
          });
  
        })
        .catch(e => {
          console.log(e);
      });

      //this.dispatchEvent(new FlowAttributeChangeEvent('ContactPointBillingAddressId', this.cpLabelId));

    }
    

    
}