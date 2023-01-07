import { LightningElement,api,track,wire } from 'lwc';
import registerUser from '@salesforce/apex/AxisUser.registerUser';
import isEmailPhoneExist from '@salesforce/apex/AxisUser.isEmailPhoneExist';
import pset from '@salesforce/apex/AxisUser.pset';

// import getPSAForPsGroups from '@salesforce/apex/B2B_PermissionSetGroupAssignmentUtils.getPSAForPsGroups'
export default class axisBikeRegistrationPage extends LightningElement 
{
    @api showModal = false; // to show the modal for an error success or any warning
    firstName = ''; // first name I have passed the apex class full name = firsrName+LastName;
    lastName = '';
    email = null;
    username = null;
    password = null;
    confirmPassword='';
    phone =''; 

    isAccountUser = false;
    accountName = null;
    psetGroupId = '0PGDS000000L0TX4A0';
    newUID;
    loginUrl;

    // @track navigationVar;
    // Error Handling

    errorCheck;
    defaultErrorMsg;
    emailError;
    errorMessage;
    passwordTooltip='tooltiptext tooltipHide';
    passwordTooltiperror = 'tooltiptext tooltipHide';



    // @track
    // @track error;
    userName = '';
    userCreated = false;
    showUserName;
    pageLoading = true;
    tooltip_style ='tooltiptext';
    tooltip_styleShow = 'tooltiptext tooltipShow';
    tooltip_styleHide = 'tooltiptext tooltipHide';
    tooltip_field = 'tooltiptext tooltipHide';

    showToast = false;
    toastTitle ="This Field is Required";
    toastMessage = "Please enter the correct/Required Value";


    connectedCallback()
    {
        this.pageLoading = false;
        this.defaultErrorMsg = "Something Went Wrong, Please Try Again after sometimes";
        this.errorCheck = false;
  
    }

    handleFirstNameChange(event)
    {
        this.firstName = event.target.value;
        if(!this.isAccountUser)
        {
            this.accountName = this.firstName + this.lastName + ' UserAccount';
            console.log(this.accountName);
        }
        if(this.lastName == '' && this.firstName == '')
        {
            this.accountName = null;
        }

    }

    handleLastNameChange(event)
    {
        this.lastName = event.target.value;
        if(!this.isAccountUser)
        {
            this.accountName = this.firstName + this.lastName + ' UserAccount';
            console.log(this.accountName);
        }
        if(this.lastName == '' && this.firstName == '')
        {
            this.accountName = null;
        }
    }

    handleEmailHover(event)
    {
        // On Hovering over Email
    }
    handleEmailChange(event)
    {
        this.email = event.target.value;
        this.userName = event.target.value + '.axis'
    }
    onEmailInvalid(event)
    {

        if (!event.target.validity.valid) 
        {
            event.target.setCustomValidity('Enter a valid email address')
        }
    }
    onEmailInput(event)
    {

        event.target.setCustomValidity('Enter a valid email address')
    }

    handlePhoneChange(event){
        this.phone = event.target.value
    }

    handlePasswordChange(event){

        this.password = event.target.value;
    }

    handleConfirmPasswordChange(event){

        this.confirmPassword = event.target.value;
    }
    
    ///////////////////////  Using Imperative Method  

    handleRegister(event)
    {

        // Field Validation
        console.log('Inside Handle Register');
        this.errorCheck = false;
        this.errorMessage = null;

        this.tooltip_field = 'tooltiptext tooltipHide';
        this.tooltip_field = 'tooltiptext tooltipHide';
        

        if(!this.firstName || this.firstName == ''){

            this.tooltip_field = 'tooltiptext tooltipShow';

        } else {

            this.tooltip_field = 'tooltiptext tooltipHide';
        }

        if(!this.lastName || this.lastName == ''){

            this.tooltip_field = 'tooltiptext tooltipShow';

        } else {
            
            this.tooltip_field = 'tooltiptext tooltipHide';
        }

        if(!this.email){

            this.tooltip_field = 'tooltiptext tooltipShow';

        } else {
            
            this.tooltip_field = 'tooltiptext tooltipHide';
        }
        if(!this.phone){

            this.tooltip_field = 'tooltiptext tooltipShow';

        } else {
            
            this.tooltip_field = 'tooltiptext tooltipHide';
        }
        if(!this.password){

            this.tooltip_field = 'tooltiptext tooltipShow';
            this.tooltip_field = "tooltiptext tooltipHide";

        } else {
            
            this.tooltip_field = 'tooltiptext tooltipHide';
        }

        if(!this.confirmPassword){

            this.tooltip_field = 'tooltiptext tooltipShow';

        } else {
            
            this.tooltip_field = 'tooltiptext tooltipHide';
        }
        //  End of field validation


        // this.showNotification();
        console.log('Inside the handleReg')
        this.pageLoading = true;
        this.errorCheck = false;
        this.errorMessage = null;
        // this.tooltip_style ='tooltiptext tooltipHide';
        this.showToast = false;

        if(this.firstName && this.lastName && this.email && this.userName && this.phone && this.password && this.confirmPassword)
        {

            this.pageLoading = true;

            if(this.password != this.confirmPassword){

                this.tooltip_field = "tooltiptext tooltipHide";
                this.passwordError = 'Password did not match. Please Make sure both the passwords match.';
                this.passwordTooltiperror = 'tooltiptext tooltipShow tooltipError';

                event.preventDefault();

                this.pageLoading = false;
                
                return;
            }
        }
        this.pageLoading=true;
        let emailCheck = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email);
        this.pageLoading =false;
        console.log('debug1');
        if( emailCheck == null || emailCheck == undefined || emailCheck == false )
        {
            this.emailError= 'Please enter a valid email Address!'
            this.showNotification();
            console.log('Check2');
            return;
        }
        this.pageLoading = true;

        console.log('debug2');


        ///////////
        let passwordCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(this.password);

        if(passwordCheck == null || passwordCheck == undefined || passwordCheck == false){
            console.log('debug3');
            this.pageLoading = false;
            this.passwordError = 'Password must be Minimum eight characters, at least one letter, one number and one special character.';
            this.passwordTooltiperror = 'tooltiptext tooltipShow tooltipError';


            
            return;
        } 
        if(this.accountName == 'Allice Zane Registered' || this.accountName ==  ' UserAccount' || this.accountName == null)
        {
            this.errorCheck = true;
            console.log('Account Assignment Error');
            this.errorMessage = 'Please Refresh and Retry to Enter all Required Field';
            this.pageLoading = false;
            return;
        }


        console.log('debug3-1');
        event.preventDefault();
        
        //apex class call
        
        isEmailPhoneExist({Email: this.email,Phone:this.phone})
        .then((result) =>{
            if(result != null && result != undefined && result == true)
            {
                console.log('debug4');
                console.log('result', result)
                this.emailError="Your Email or Phone Number already exists somewhere in the System";
                this.pageLoading = false;
                console.log('Check 3-Your Email or Phone Number already exists');
                    
            }
            else {

                registerUser({ firstName: this.firstName, lastName: this.lastName, 
                    email: this.email, phone:this.phone, accountName : this.accountName, 
                    pass:this.password, orgUser:this.isAccountUser})
                    .then((result1) => 
                    {
                                    
                        if(result1){    
            
                            
                            // console.log(JSON.stringify(result1));
                            console.log('Yay! User Created Successfully');
                            this.newUID = result1[1];
                            this.loginUrl = result1[3];
                                console.log(this.newUID);
                            console.log(this.loginUrl);
                            console.log(result1);
                            // window.location.href = this.loginUrl;

                            this.userCreated  =true;
                            this.assignPS();
                        
                        }
                        this.pageLoading = false;
                    })
                    .catch((error) => {
                        console.log('debugT2');
                        
        
                        console.log('error-',error);
                        // console.log('Check 5');

                        this.pageLoading = false;
        
                        if(error && error.body && error.body.message){
        
                            this.errorCheck = true;
                            this.errorMessage = error.body.message;
                            console.log('Check 6');
                            
                        
                        }                               
                        });
                    }
                    console.log(JSON.stringify(result));
                    console.log("result", this.message);
                            })
                            .catch((error) => {
                                this.error = error;
                                console.log('debugT3');
                            
                                if(error && error.body && error.body.message){
                                    // console.log('Check 7');
                                    console.log('error msg-', error.body.message);
                                }

                                this.pageLoading = false;
                                
                            });
    }
    // Assigning Permission Sets to new User

    assignPS()
    { 
        this.pageLoading = true;
        pset({permissionsetGroupsID:this.psetGroupId, userId:this.newUID})
        .then((result2) =>
        {
            console.log(result2);
            console.log(this.loginUrl);
            window.location.href = this.loginUrl;

        })
        .catch((error) =>
        {

            this.error = error;
            console.log('debugT4');
            this.pageLoading =false;
            console.log(error);
        });
    }

    /////// end of Ps assignment




    //end of function JS
}