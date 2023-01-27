public with sharing class B2bPOchck {
    public B2bPOchck() {

    }
    @AuraEnabled
    public static Boolean getPoNumber(String UserId){
        try {
            User cname = [SELECT Id, ContactId from User WHERE Id=:UserId];
            Contact Cntname  = [SELECT Id, AccountId, Name,Phone,Email from Contact WHERE Id=:cname.ContactId];
            Account ac = [SELECT PO_Number__c from Account WHERE Id =:Cntname.AccountId];

            return ac.PO_Number__c;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}