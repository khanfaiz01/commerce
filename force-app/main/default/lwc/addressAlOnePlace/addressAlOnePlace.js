import { LightningElement,track,api } from 'lwc';
import UId from '@salesforce/user/Id';
import  getShippingAddress from '@salesforce/apex/B2b_NewShippingAddress.getShippingAddress';
// import  getcpaId from '@salesforce/apex/B2BGetAddress.getcpaId';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import  getBillingAddress from '@salesforce/apex/B2b_NewShippingAddress.getBillingAddress';
import getBuyerInfo  from '@salesforce/apex/B2b_NewShippingAddress.getBuyerInfo';


export default class B2bAddNewShippingAddress extends LightningElement {
    @track buyerInfo={};
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
    isClickedOnNewAddressButton = false;
    @api shippingInstruction;
    @api recordId;

    value;
    options;
    ShippingValue = this.value;
    cpAddress;
   @api noerror;
   @api allSet = false;
    @api shippingCPAId;
    connectedCallback()
    {

        // console.log(this.noerror);
        this.getOptions();
        this.getBillingOptions();
        getBuyerInfo({UserId:this.UserId
        })
        .then((result)=>{
            console.log('buyer Info '+result);
            this.buyerInfo = result
            
        }).catch((error)=>{
            console.log(error);
        });
    }
    disconnectedCallback()
    {
        this.validateFields();
    }

    // checking if all the fields are selected

    validateFields()
    {
        if(this.billingvalue && this.value)
        {
            this.allSet = true; 
        }
        else
        {
            this.allSet = false;
        }

        this.dispatchEvent(new FlowAttributeChangeEvent('allSet', this.allSet));
        // console.log(this.allSet);
    }

    @api isDefaultShipping;
    @api isDefaultBilling;
    getOptions() {
        getShippingAddress({userId:this.UserId})
          .then((result) => {
             let options = [];
             
            if (result) {
              result.forEach(r => {
                if(r.IsDefault)
                {
                    this.value = r.Name+', '+r.Street+', '+r.City+', '+r.State+', '+r.PostalCode+', '+r.Country;
                    
                }
   
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

    handleChange(event) 
    {

        this.value = event.detail.value;
        this.cpAddress = event.target.options.find(opt => opt.value === event.detail.value).label;
        console.log('cpAddress: ' +  this.cpAddress);

        getcpaId({label : this.cpAddress})
        .then((result)=>
        {
            this.shippingCPAId = result;
            // console.log(this.shippingCPAId);
            this.validateFields();
        })

    if(!(this.isClickedOnNewAddressButton))
        {
            console.log('contact point address sent to flow!');
        this.dispatchEvent(new FlowAttributeChangeEvent('ContactPointAddressId', this.shippingCPAId));
        }
    }


    // Handle Billing Address
    billingLabel
    selectedBillingAddress
    @api billingCPAId;
    handleBillingChange(event) 
    {
        this.billingvalue = event.detail.value;
        this.billingLabel = event.target.options.find(opt => opt.value === event.detail.value).label;
        getcpaId({label : this.billingLabel})
        .then((result)=>
        {
            this.selectedBillingAddress = result;
            this.billingCPAId = this.selectedBillingAddress;
            // console.log(this.shippingCPAId);
            this.validateFields();
        })

        this.validateFields();

    }

    billingvalue;
    billingOptions;
    // @api recordId;
    // connectedCallback()
    // {
       
    // }

    getBillingOptions() {
        getBillingAddress({userId:this.UserId})
          .then((result) => {
             let options = [];
            if (result) {
              result.forEach(r => {
                if(r.IsDefault)
                {
                    this.billingvalue = r.Name+', '+r.Street+', '+r.City+', '+r.State+', '+r.PostalCode+', '+r.Country;
                }
                options.push({
                  label: r.Name,
                  value: r.Name+', '+r.City+', '+r.State+', '+r.PostalCode+', '+r.Country,
                });
              });
            }
            this.billingOptions = options;
          })
          .catch((error) => {
            // handle Error
            console.log(error);
          });
      }




    // end of billing
}