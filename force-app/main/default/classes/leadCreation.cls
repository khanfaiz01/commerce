// Md Faizan Khan--------------

public with sharing class leadCreation {
    public leadCreation() {

    }
    // @AuraEnabled(cacheable = true)
    // public static List<B2B_Inventory__c> getAvailableqty(){
    //     Product2 ps = [select StockKeepingUnit from Product2];
    //     return [select Id, Initial_Stock__c, Consumed_Items__c, Current_Stock__c from B2B_Inventory__c WHERE Product__r.StockKeepingUnit =:ps.StockKeepingUnit];
            
    // }

    // Lead Creation------------------
    @AuraEnabled
    public static Lead insertLead(String firstName, String lastName, String email, String company, String description){
        Lead lds = new Lead();
        try {
            lds.FirstName = firstName;
            lds.LastName = lastName;
            lds.Email = email;
            lds.Company = company;
            lds.Description = description;
            lds.OwnerId ='00GDS00000B43F82AJ';
            insert lds;
            return lds;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // case Creation ---------------------
    @AuraEnabled
    public static Case insertCase(String description, String userId){
         User cname = [SELECT Id, ContactId from User WHERE Id=:userId];
         Contact Cntname  = [SELECT Id, AccountId, Name from Contact WHERE Id=:cname.ContactId]; 
        Case cs = new Case();
        try {
            cs.Description = description;
            cs.OwnerId = '00GDS00000B43Fk2AJ';
            cs.ContactId = Cntname.Id;
            cs.AccountId = Cntname.AccountId;
            insert cs;
            return cs;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}