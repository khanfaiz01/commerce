// Start of Class-------Md Faizan Khan

public without sharing class B2b_RegiserUserPageDemo {

// Check if email or Phone exist or not if Email or Phone Exist then Do Not Create another user account

    @AuraEnabled
    public static Map<String,Boolean> chekEmailPhoneExist(String Email, string Phone){
        Map<String,Boolean> dataMap = new Map<String,Boolean>();
        try 
        {
            List <Contact> emailCon = [Select id,Email FROM Contact Where Email =:Email];
            if(emailCon.isEmpty())
            {
                dataMap.put('email',false);
            }
            else
            {
                dataMap.put('email',true);
            }
            List <Contact> phoneCon = [Select id,Phone FROM Contact Where Phone =:Phone];
            if(phoneCon.isEmpty())
            {
                dataMap.put('Phone',false);
            }
            else
            {
                dataMap.put('phone',true);
            } 
            return dataMap;     
        } 
        catch (Exception e) 
        {
            throw new AuraHandledException('User Already Exist Exception' + e.getMessage());
        }
    }   
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // registration of new user----------------

    @AuraEnabled
    public static Map<String,String> userRegistration(string firstName, String lastName, 
                                            string email, string phone, 
                                            string accountName,string pass,boolean orgUser)
    {
        Map<String,String> dataMap = new Map<String,String>();
        String returnVal = 'Unknown Error';
        List<String>accVal = new List<String>();
            Account userAc = new Account();
            userAc.Name = firstName + lastName +' UserAccount';
            userAc.CurrencyIsoCode = 'USD';
            insert userAc;

            userAc.IsPartner = true;
            upsert userAc;

            BuyerAccount buyerAccount = new BuyerAccount();
            buyerAccount.BuyerId = userAc.Id;
            buyerAccount.Name = userAc.Name;
            buyerAccount.IsActive = true;
            upsert buyerAccount;

            BuyerGroupMember bm = new BuyerGroupMember();
            bm.buyerId = userAc.Id;
            bm.BuyerGroupId = System.Label.B2bbuyerGPId;
            upsert bm;
        
            String acctID = userAc.Id;
            String acctName = userAc.Name;

            Contact con = new Contact();
            con.Lastname = firstName +' '+ lastName;
            con.Email = email;
            con.Phone = phone;
            con.AccountId = acctID;
            con.CurrencyIsoCode =  'USD';
            insert con;

                // generating a random number:
            String temp = String.valueOf(DateTime.now().getTime());

            String uAlias = firstName.SubString(0,1) + lastName.SubString(0,2)+temp.SubString(0,4);
            User u = new User(TimeZoneSidKey='America/Los_Angeles',
            LocaleSidKey='en_US',LanguageLocaleKey='en_US',
            ProfileId = System.Label.B2bprofileId,
            EmailEncodingKey='ISO-8859-1',
            Alias =uAlias,
            Username = email+'.axis',
            Email = email,FirstName = firstName, LastName=lastName,Phone=phone,
            ContactId = con.Id ,
            CommunityNickName = firstName +' '+ lastName + temp.SubString(0,3) );

            System.debug('User Created Successfully');
            dataMap.put('Success','User Created Successfully');

            try
            {
                String userId = Site.createExternalUser(u, acctId, pass);
                if(userId != null)
                {
                    dataMap.put('userId',userId);
                    returnVal = userId;
                    String emailResult = sendWelcomeMail(u, returnVal);

                    // Site Login Syntax for the user when created

                    ApexPages.PageReference pageRef = Site.login(u.Username,pass,'training202104--fkhan.sandbox.my.site.com/s');
                    dataMap.put('loginUrl',pageRef.getURL());
                                                            
                }
            }
                catch(Site.ExternalUserCreateException e)
                {
                    List <String> errors = e.getDisplayMessages();
                    for(String error:errors)
                    {
                        System.debug('error:' +error);
                    }
                    System.debug(e.getMessage());
                    dataMap.put('error',e.getMessage());
                }

                return dataMap;
        // end of function    
        }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// SEND A WELCOME EMAIL  TO THE USER AT THE TIME OF CREATION ----------------------------
 @AuraEnabled
    public static String sendWelcomeMail(User usr, String userId){
        try {

            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

            List<EmailTemplate> welcomeTemplate = new List<EmailTemplate>([Select Id from EmailTemplate where 
            name = 'Welcome to Axis Bike Store']);
                     
            mail.setSenderDisplayName('Axis Bike Store');
            mail.setTargetObjectId(userId);
            mail.setTemplateId(welcomeTemplate[0].Id);
            mail.setSaveAsActivity(false);

            Messaging.sendEmail( new List<Messaging.SingleEmailMessage>{mail} );

            return 'success';

        } catch (Exception e) {            
            throw new AuraHandledException('Email Error:'+ e.getMessage());
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Permission Set Assignment Method TO THE USER
    @AuraEnabled
    public static String pset(Id userId)
    {
        ID psetGroupId = System.Label.B2bStoreps;
        List<PermissionSetAssignment> psAssignments= new List<PermissionSetAssignment>();
        PermissionSetAssignment assignment = new PermissionSetAssignment(
            PermissionSetGroupId = psetGroupId, AssigneeId = userId
        );

        System.debug(assignment);

        psAssignments.add(assignment);
        upsert psAssignments;
        

        return 'SuccessAssignment' ;
    }
}

// End Of Class-----------