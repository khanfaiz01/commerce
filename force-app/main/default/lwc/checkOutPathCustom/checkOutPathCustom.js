import { LightningElement,api } from 'lwc';

export default class CheckOutPathCustom extends LightningElement {
    
    @api currentStage='';
    @api Stages;
    connectedCallback(){

    }
    
}