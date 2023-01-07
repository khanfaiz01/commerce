public without sharing class B2b_NewShippingAddress {
    public B2b_NewShippingAddress() {

    }
    @AuraEnabled
    public static List<ContactPointAddress> getBillingAddress(String userId){
        User cname = [SELECT Id, ContactId from User WHERE Id=:userId];
        Contact Cntname  = [SELECT Id, AccountId, Name from Contact WHERE Id=:cname.ContactId];
        try {
            List<ContactPointAddress> cntAddress = [SELECT Id,Name, City, State, PostalCode, Country 
            from ContactPointAddress WHERE AddressType ='Billing' AND ParentId =:Cntname.AccountId];
            return cntAddress;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static ContactPointAddress newShippingAddress(String name,String street, String city, 
                                    String state,String postalCode,String country, String userId){
        //ContactPointAddress conadd = [SELECT Id, Name, Address, AddressType FROM ContactPointAddress ];
        User cname = [SELECT Id, ContactId from User WHERE Id=:userId];
        Contact Cntname  = [SELECT Id, AccountId, Name from Contact WHERE Id=:cname.ContactId]; 
        ContactPointAddress ship = new ContactPointAddress();
        ship.Name= name;
        ship.Street = street;
        ship.City = city;
        ship.State = state;
        ship.PostalCode = postalCode;
        ship.Country = country;
        ship.AddressType = 'Shipping';
        ship.ParentId = Cntname.AccountId;
        insert ship;
        return ship;
    }

    @AuraEnabled
    public static List<ContactPointAddress> getShippingAddress(String userId){
        User cname = [SELECT Id, ContactId from User WHERE Id=:userId];
        Contact Cntname  = [SELECT Id, AccountId, Name from Contact WHERE Id=:cname.ContactId];
        try {
            List<ContactPointAddress> shipAddress = [SELECT Id,Name,Street, City, State, PostalCode, Country 
            from ContactPointAddress WHERE AddressType ='Shipping' AND ParentId =:Cntname.AccountId];
            return shipAddress;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
