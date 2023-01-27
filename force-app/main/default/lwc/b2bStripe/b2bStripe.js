
import { LightningElement,api,wire, track } from 'lwc';
import getPaymentInfo from '@salesforce/apex/B2BPaymentController.getPaymentInfo';
import { NavigationMixin } from 'lightning/navigation';
import setPaymentInfo from '@salesforce/apex/B2BPaymentController.setPaymentInfo';

import getVFOrigin from '@salesforce/apex/B2BPaymentController.getVFOrigin';

import updatePAError from '@salesforce/apex/B2BPaymentController.updatePaymentAuthError';

import submitCreditCardOrder from '@salesforce/apex/B2BPaymentController.submitCreditCardOrder';

import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';
import UID from '@salesforce/user/Id';
import getPoNumber from '@salesforce/apex/B2bPOchck.getPoNumber';
import getCartTotal from '@salesforce/apex/B2b_NewShippingAddress.getCartTotal';


export default class B2bStripe extends LightningElement {

    @api cartId;
    @api purchaseOrder;
    cart;
    iframeUrl;
    // Wire getVFOrigin Apex method to a Property
    @wire(getVFOrigin)
    vfOrigin;
    @track cartdata;
    showCard = false;
    showPO = false
    showOthers = false;
    msg = true;

    @track carttax;
    @track carttotal;
    @track cartsubtotal;
    @track cartshipcost;


    @track po;
    userId = UID;

    canPay = false;
    stripeCustomerId = '';
    iframeUrl;
    showSpinner = false;
    connectedCallback() {
        window.addEventListener("message", this.handleVFResponse.bind(this));
        let dataMap = {
            cartId: this.cartId
        };
        this.showSpinner = true;
        getPaymentInfo({
            dataMap: dataMap
        }).then((result) => {
                this.showSpinner = false;
                if (result && result.isSuccess) {
                    this.canPay = result.canPay;
                    this.cart = result.cart;
                    this.stripeCustomerId = result.stripeCustomerId ;
                    this.iframeUrl = result.iframeUrl;
                } else {
                    this.showToast('No payment Methods Found', 'error');
                }
                console.log(result);
            })
            .catch((e) => {
                this.showToast(
                    'Some Error occured while processing this Opportunity,Please contact System admin.',
                    'error'
                );
        });
        getPoNumber({UserId:this.userId
        }).then((res)=>{
            this.po = res;
        })
        .catch((error)=>{
            console.log(error);
        });
        getCartTotal({cartId:this.cartId
        })
        .then((result)=>{
            this.cartsubtotal = result.stotal,
            this.cartshipcost = result.Ccost,
            this.carttax = result.tax,
            this.carttotal = result.total
        }).catch((error)=>{
            console.log(error);
        })
    }
    showToast(message ,variant) {
        let title = variant == 'error' ? 'Error' : 'Success';
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
    handlePO(event){
        this.purchaseOrder = event.target.value;
    }
    handleVFResponse(message){
        console.log('handleVFResponse');
        console.log(message);
        var cmp = this;
        if (message.origin === this.vfOrigin.data) {
            let receivedMessage = message.data;
            if(receivedMessage && receivedMessage != null){
                if(receivedMessage.hasOwnProperty('paId')){
                    let dataMap = {
                        paId: receivedMessage.paId
                    }
                    updatePAError({dataMap: dataMap})
                    .then(function (result) {
                        cmp.showSpinner = false;
                    });
                }else{
                    if(receivedMessage.cToken && receivedMessage.cToken != null &&  receivedMessage.cToken.token && receivedMessage.cToken.token != null){
                        if(this.submitOrderCalled){
                            return ;
                        }
                        this.submitOrderCalled = true;
                        this.submitCCOrder(receivedMessage);
                    }
                }
            }
        }
    }

    submitCCOrder(receivedMessage){
        let dataMap = {
            "cartId": this.cartId,
            "paymentMethod": 'CC',
            "stripeCustomerId": this.stripeCustomerId,
            "cToken": receivedMessage.cToken.token,
            "cPay" : receivedMessage.cPay.paymentIntent,
            "cTokenId": receivedMessage.cToken.token.id,
            "cPayId" : receivedMessage.cPay.paymentIntent.id
        };
        submitCreditCardOrder({
            dataMap: dataMap
        }).then((result) => {
            this.showSpinner = false;
            if(result && result.isSuccess){
                const navigateNextEvent = new FlowNavigationNextEvent();
                this.dispatchEvent(navigateNextEvent);
            }else{
                this.showToast(result.msg,'error');
            }
        }).catch((e) => {
            this.showToast(
                e.message,
                'error'
            );
        });
    }

    errorCallback(err) {
        alert(err);
    }

    submitOrder(event){
        let dataMap = {
            "cartId": this.cartId,
            "paymentMethod": 'CC',
            "stripeCustomerId": this.stripeCustomerId
        };
        this.showSpinner = true;
        setPaymentInfo({
            dataMap: dataMap
        }).then((result) => {
            
            if(result && result.PI_Secret){
                result.billing_details = {
                    name : this.cart.CreatedBy.Name,
                    email : this.cart.CreatedBy.Email
                };
                this.handleFiretoVF(result);
            }
            if(result){
                const navigateNextEvent = new FlowNavigationNextEvent();
                this.dispatchEvent(navigateNextEvent);
            }else{
                this.showToast(result.msg,'error');
            }
        }).catch((e) => {
            this.showToast(
                e.message,
                'error'
            );
        });
    }

    handleFiretoVF(message) {
        console.log('handleFiretoVF');
        this.template.querySelector("iframe").contentWindow.postMessage(message, this.vfOrigin.data);
    }

    handleCredit(event){
       this.showCard = true;
       this.showPO = false;
       this.showOthers = false;
       this.msg = false;
    }
    handlePON(){
        this.showPO = true;
        this.showCard = false;
        this.showOthers = false;
        this.msg = false;

    }
    handleOther(){
        this.showOthers = true;
        this.showPO = false;
        this.showCard = false;
        this.msg = false;
        
    }
    submitPO(){
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent); 
    }

}