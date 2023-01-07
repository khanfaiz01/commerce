import { LightningElement, api,track } from 'lwc';
import SOCIAL from '@salesforce/resourceUrl/FooterIcons';
import isguest from '@salesforce/user/isGuest';
import UId from '@salesforce/user/Id';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import FIRSTNAME_FIELD from '@salesforce/schema/Lead.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Lead.LastName';
import EMAIL_FIELD from '@salesforce/schema/Lead.Email';
import COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import DESCRIPTION_FIELD from '@salesforce/schema/Lead.Description';
import insertLead from '@salesforce/apex/leadCreation.insertLead';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import insertCase from '@salesforce/apex/leadCreation.insertCase';
import DESCRIPTION_FIELDS from '@salesforce/schema/Case.Description';

export default class FooterAxisStore extends LightningElement {

    @track isShowModal = false;
    @track isGuestUser = isguest;
    @track UserId = UId;

    @track firstName= FIRSTNAME_FIELD;
    @track lastName= LASTNAME_FIELD;
    @track email= EMAIL_FIELD;
    @track company= COMPANY_FIELD;
    @track description= DESCRIPTION_FIELD;

    @track description= DESCRIPTION_FIELDS;

    
    ABOUT_COMPANY={
        NAME:'Axis Bike Store',
        ROLE:'Full Stack Developer',
        EMAIL:'axisbike@gmail.com',
        PHONE:'+91 9161359495',
        HOME: 'New Delhi, 110001, India',
        CHAT: '+91 9161359495'
    }

    SOCIAL_LINKS=[
        {
            type:'twitter',
            label:"twitter",
            //link:"https://twitter.com/Spartan",
            icon:SOCIAL + '/FooterIcons/Twitter.svg'
        },
        {
            type: "facebook",
            label: "facebook",
            //link: "https://facebook.com/Spartan",
            icon: SOCIAL + '/FooterIcons/Facebook.svg'
        },
        {
            type: "linkedin",
            label: "linkedin",
            //link: "https://www.linkedin.com/in/Spartan/",
            icon: SOCIAL + '/FooterIcons/LinkedIn.svg'
        },
        {
            type: "youtube",
            label: "youtube",
            //link: "https://www.linkedin.com/in/Spartan/",
            icon: SOCIAL + '/FooterIcons/Youtube.svg'
        },
    ]
    COMPANY_SUMMARY={
        DESCRIPTION: "Axis Cycle Works is an established bicycle specialty store, offering retail sales of new bicycles, parts and accessories, clothing, and maintenance and repair service. It is located in a heavily trafficked, university-focused area.",
    }
//////////////////////////////////////////////////////
        showModalBox(){  
            this.isShowModal = true;
        }
    
        hideModalBox() {  
            this.isShowModal = false;
        }

        leadChangefirst(event){
            this.firstName = event.target.value;
        }
        leadChangelast(event){
            this.lastName = event.target.value;
        }
        leadChangeemail(event){
            this.email = event.target.value;
        }
        leadChangecomp(event){
            this.company = event.target.value;
        }
        leadChangedesc(event){
            this.description = event.target.value;
        }

        caseChangedesc(event){
            this.description = event.target.value;

        }

        insertLeadAction(){
            insertLead({firstName:this.firstName,lastName:this.lastName,email:this.email,company:this.company,description:this.description})
                .then(result => {
                    this.message = result;
                    this.error = undefined;
                    if(this.message !== undefined) {
                        this.firstName = '';
                        this.lastName = '';
                        this.email = '';
                        this.company='';
                        this.description='';
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Form Submitted Succesfully',
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
                            title: 'Failed to Save the record',
                            message: error.body.message,
                            variant: 'error',
                        }),
                    );
                    console.log("error", JSON.stringify(this.error));
                });
        
        }
        createCaseAction(){
            insertCase({description:this.description, userId:this.UserId})
            .then(result => {
                this.message = result;
                this.error = undefined;
                if(this.message !== undefined) {
                    this.description='';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Case Submitted Succesfully',
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