// Start of Class-------Md Faizan Khan

public without sharing class AxisUser {
    
    public AxisUser() 
    {

    }

    // Check if email or Phone exist or not if Email or Phone Exist then Do Not Create another user account

    @AuraEnabled
    public static boolean isEmailPhoneExist(String Email, string Phone){
        try 
        {
            List <Contact> emailCon = [Select id,Email FROM Contact Where Email =:email OR Phone =:Phone];
            if(emailCon.isEmpty())
            {
                return false;
            }
            else
            {
                return true;
            }   
        } 
        catch (Exception e) 
        {
            throw new AuraHandledException('User Already Exist Exception' + e.getMessage());
        }
    }   
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // registration of new user----------------

    @AuraEnabled
    public static List<String> registerUser(string firstName, String lastName, string email, string phone, 
                                            string accountName,string pass,boolean orgUser)
    {
        List <String> returnList = new List <String>();
        returnList.add('welcome');
        returnList.add('userID');
        returnList.add('No Error');
        String returnVal = 'Unknown Error';
        boolean alreadyIndivisualUser = checkExistingUserAc(firstName,lastName);
        List<String>accVal = new List<String>();
        if(!orgUser)
        {
            accVal =  accountHandling(accountName, firstName, lastName, orgUser);
        }
        
                String acctID;
                String acctName;
                acctID = accVal.get(0);
                acctName = accVal.get(1);

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
                ProfileId='00eDS000001n2OhYAI',
                EmailEncodingKey='ISO-8859-1',
                Alias =uAlias,
                Username = email+'.axis',
                Email = email,FirstName = firstName, LastName=lastName,Phone=phone,
                ContactId = con.Id ,
                CommunityNickName = firstName +' '+ lastName + temp.SubString(0,3) );

                System.debug('User Created Successfully');
                returnList.add(0,'User Created Successfully');

                try
                {
                    String userId = Site.createExternalUser(u, acctId, pass);
                    if(userId != null)
                    {
                        returnList.add(1,userId);
                        returnVal = userId;
                        String emailResult = sendWelcomeMail(u, returnVal);

                        // Site Login Syntax for the user when created

                        ApexPages.PageReference pageRef = Site.login(u.Username,pass,'training202104--fkhan.sandbox.my.site.com/s');
                        returnList.add(3,pageRef.getURL());
                                                              
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
                    returnList.add(2,e.getMessage());
                }

                return returnList;
        // end of function    
        }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// SEND A WELCOME EMAIL  TO THE USER AT THE TIME OF CREATION ----------------------------
 @AuraEnabled
    public static String sendWelcomeMail(User usr, String userId){
        try {

            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

            List<EmailTemplate> welcomeTemplate = new List<EmailTemplate>([Select Id from EmailTemplate where name = 'Welcome to Axis Bike Store']);
                     
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
    public static String pset(String permissionsetGroupsID, Id userId)
    {
        ID psetGroupId = permissionsetGroupsID;
        List<PermissionSetAssignment> psAssignments= new List<PermissionSetAssignment>();
        PermissionSetAssignment assignment = new PermissionSetAssignment(
            PermissionSetGroupId = psetGroupId, AssigneeId = userId
        );

        System.debug(assignment);

        psAssignments.add(assignment);
        upsert psAssignments;
        

        return 'SuccessAssignment' ;
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Method to Create User Account

    @AuraEnabled
    public static List<String> accountHandling(String accountName,String firstName, String lastName, boolean orgUser)
    {
        List<String>accVal = new List<String>();
        try 
            {
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
                    bm.BuyerGroupId = '0ZIDS000000GmbR4AS'; 
                    upsert bm;

                    accVal.add(userAc.Id);
                    accVal.add(userAc.Name);
                    return accVal;

            } 
            catch (Exception e) 
            {
                    System.debug('Account Error'  + e.getMessage());
                    throw new AuraHandledException('User Account Already exist: '  + e.getMessage());
                    
            }
    }
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// check if User account already exist
    @AuraEnabled
    public static Boolean checkExistingUserAc(String firstName, String lastName)
    {
        try 
        {
            String acName = firstName + lastName +' UserAccount';
            List<Account> ac = [SELECT Id, Name FROM Account Where Name =: acName LIMIT 2];
            if(ac.isEmpty())
            {
                return false;
            }
            else
            {
                throw new AuraHandledException('Account Already Exist');

            }
        } 
        catch (Exception e) 
        {
            throw new AuraHandledException('User Account Already Exist: ' + e.getMessage());
        }
    }
}


// End Of Class-----------