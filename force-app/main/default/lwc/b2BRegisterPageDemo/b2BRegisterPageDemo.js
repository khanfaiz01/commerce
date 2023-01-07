import { LightningElement } from 'lwc';
import chekEmailPhoneExist from '@salesforce/apex/B2b_RegiserUserPageDemo.chekEmailPhoneExist';
import userRegistration from '@salesforce/apex/B2b_RegiserUserPageDemo.userRegistration';
import pset from '@salesforce/apex/B2b_RegiserUserPageDemo.pset';

export default class B2BRegisterPageDemo extends LightningElement {
    firstName = '';
    lastName = '';
    email = '';
    userName = ''
    phone = '';
    password = '';
    confirmPassword='';
    pageLoading = false;
    isAccountUser = false;
    userCreated = false;
    toastMessage = 'please eneter the correct/required Vlaue';

    errorCheck;
    errorMessage;
    passwordTooltip = 'tooltiptext tooltipHide';
    Tooltiperror = 'tooltiptext tooltipHHide';
    passwordError='';
    emailError='';
    phoneError='';

    systemError = '';
    Errormsg = '';

    connectedCallback()
    {
        this.pageLoading = false;
        this.defaultErrorMsg = "Something Went Wrong, Please Try Again after sometimes";
        this.errorCheck = false;
    }
    // ------------------------------------------------------------------------------------
    handlePasswordError(){
        this.passwordError = this.Errormsg;
    }
    handleEmailError(){
        this.emailError = this.Errormsg;
    }
    handleSystemError(){
        this.systemError = this.Errormsg;
    }
    handlePhoneError(){
        this.phoneError = this.Errormsg;
    }
// ------------------------------------------------------------------------------------------------
    handlefisrtName(event){
        this.firstName = event.target.value;
        if(!this.isAccountUser){
            this.accountName = this.firstName +this.lastName + 'UserAccount'
        }
        if(this.lastName == '' && this.firstName == ''){
            this.accountName = null;
        }

    }
    handleLastName(event){
        this.lastName = event.target.value;
        if(!this.isAccountUser){
            this.accountName = this.firstName +this.lastName + 'UserAccount'
        }
        if(this.lastName == '' && this.firstName == ''){
            this.accountName = null;
        }

    }
    handleEmail(event){
        this.emailError ='';
        this.email = event.target.value;
        this.userName = event.target.value + '.axis'

    }
    handlePhone(event){
        this.phoneError ='';
        this.phone = event.target.value;

    }
    handlePassword(event){
        this.password = event.target.value;

    }
    handleConfirmPassword(event){
        this.passwordError ='';
        this.confirmPassword = event.target.value;
    }
 // -----------------------------------------------------------------------------------------------
    handleRegister(event){
        this.pageLoading = true;
        if(this.firstName && this.lastName && this.email && this.userName && 
            this.phone && this.password && this.confirmPassword){
                this.pageLoading = true;
                if(this.password != this.confirmPassword){
                    this.Errormsg = 'password did not match, please make sure both the password match';
                    this.Tooltiperror = 'tooltiptext tooltipShow tooltipError';
                    event.preventDefault();
                    this.pageLoading = false;
                    this.handlePasswordError();
                    return;
                }
        }
        this.pageLoading = true;
        console.log('debug2');
        let passwordCheck = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(this.password);
        if(passwordCheck==null || passwordCheck== undefined || passwordCheck == false){
            console.log('debug3')
            this.pageLoading = false;
            this.Errormsg = 'Password did not match the critera, please click on i to know more';
            this.Tooltiperror = 'tooltiptext tooltipShow tooltipError';
            this.handlePasswordError();
            return;
        }
        if(this.accountName == '' || this.accountName =='UserAccount' || this.accountName ==null){
            this.errorCheck = true;
            console.log('Account Assignment Error');
            this.errorMessage = 'Please Refresh the Page and retry to enter all the details';
            this.pageLoading = false;
            return;
        }

        console.log('debug 3-1');
        event.preventDefault();

    
        chekEmailPhoneExist({Email:this.email, Phone:this.phone})
        .then(result =>{
            if(result !=null && result !=undefined && (result.email == true || result.phone==true)){
                console.log('debug4');
                console.log(result.email);
                console.log(result.phone);
                this.pageLoading = false;
                if(result.email==true){
                    console.log('Inside Email error');
                    this.Errormsg = 'Email already Exist';
                    this.Tooltiperror = 'tooltiptext tooltipShow tooltipError';
                    this.handleEmailError();
                }
                else if(result.phone==true){
                    console.log('inside Phone Error');
                    this.Errormsg = 'Phone already Exist';
                    this.Tooltiperror = 'tooltiptext tooltipShow tooltipError';
                    this.handlePhoneError();
                }
                
            }
            else{
                userRegistration({firstName: this.firstName, lastName:this.lastName, 
                    email:this.email, phone:this.phone, accountName:this.accountName, 
                    pass:this.password, orgUser:this.isAccountUser})
                    .then(result1=>{
                        if(result1){
                            console.log('user Created Successfully');
                            this.newUID = result1.userId;
                            this.loginUrl = result1.loginUrl;
                            console.log(this.newUID);
                            console.log(this.loginUrl);
                            console.log(result1);

                            this.userCreated = true;
                            this.assignPS();

                            // assign permission set here
                        }
                        this.pageLoading = false;
                    })
                    .catch(error=>{
                        console.log('debug T2');
                        console.log('error-',error);

                        this.pageLoading = false;
                        
                        if(error && error.body && error.body.message){
                            this.errorCheck = true;
                            this.errorMessage = error.body.message;
                            console.log('Check 6');
                        }
                    })
            }

        })
        .catch(error=>{
            this.error = error;
            console.log('debugT3');
            if(error && error.body && error.body.message){
                
                console.log('error msg-',error.body.message);
            }
            this.pageLoading = false;
        });
    }
    assignPS()
    { 
        this.pageLoading = true;
        pset({userId:this.newUID})
        .then((result2) =>
        {
            console.log(result2);
            //console.log(this.loginUrl);
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

}