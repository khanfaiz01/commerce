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
                                    String state,String postalCode,String country, String userId,Boolean Isdef){
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
        ship.IsDefault = Isdef;
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
    @AuraEnabled
    public static String getcpaId(String label){
        try {
            ContactPointAddress cpaId = [SELECT Id from ContactPointAddress WHERE Name =: label];
            String cpId = String.valueOf(cpaId.Id);
            return cpId;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Void updateCartBilling(String BillingId, String CartId){
        ContactPointAddress BillingAddrs = [SELECT Id,Name,IsDefault, City,Country,
        PostalCode,Street,State from ContactPointAddress WHERE Id=:BillingId AND 
        AddressType='Billing' LIMIT 1];

        WebCart cCart = [SELECT Id,Name,BillingCity, BillingCountry,BillingPostalCode,
        BillingStreet,BillingState from WebCart WHERE Id=:CartId LIMIT 1];
        System.debug('Cart Address :'+cCart);
        cCart.BillingCity = BillingAddrs.City;
        cCart.BillingCountry = BillingAddrs.Country;
        cCart.BillingPostalCode = BillingAddrs.PostalCode;
        cCart.BillingStreet = BillingAddrs.Street;
        cCart.BillingState = BillingAddrs.State;
        update cCart;
        System.debug(cCart);
        System.debug(BillingAddrs);
    }

    // in this method i am getting the saved Billing Address of the cart using the cartId
    @AuraEnabled
    public static Map<String,Object> getCartBillingAddrs(String cartId){
        try {
            WebCart cartBill = [SELECT Id,Name,BillingCity, BillingCountry,BillingPostalCode,
            BillingStreet,BillingState from WebCart WHERE Id=:cartId];
            Map<String,Object> dataMap = new Map<String,Object>();
            dataMap.put('name',cartBill.Name);
            dataMap.put('street',cartBill.BillingStreet);
            dataMap.put('city',cartBill.BillingCity);
            dataMap.put('state',cartBill.BillingState);
            dataMap.put('postal',cartBill.BillingPostalCode);
            dataMap.put('country',cartBill.BillingCountry);
            return dataMap;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    // getting the buyer information by passing the userId;
    @AuraEnabled
    public static Map<String,Object> getBuyerInfo(String UserId){
        try {
            User cname = [SELECT Id, ContactId from User WHERE Id=:UserId];
            Contact Cntname  = [SELECT Id, AccountId, Name,Phone,Email from Contact WHERE Id=:cname.ContactId];

            Map<String,Object> dataMap =  new Map<String,Object>();
            dataMap.put('name',Cntname.Name);
            dataMap.put('phone',Cntname.Phone);
            dataMap.put('email',Cntname.Email);
            return dataMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    // this is the method to save the address without saving in contact point Address
    @AuraEnabled
    public static Map<String,Object> getShip(String cartId){
        try {
            CartDeliveryGroup cartShipping = [SELECT DeliverToName, DeliverToStreet, DeliverToCity, DeliverToState, 
                                        DeliverToPostalCode,DeliverToCountry 
                                        from CartDeliveryGroup where cartId=:cartId];
            
            Map<String,Object> dataMap = new Map<String,Object>();
            dataMap.put('name',cartShipping.DeliverToName);
            dataMap.put('street',cartShipping.DeliverToStreet);
            dataMap.put('city',cartShipping.DeliverToCity);
            dataMap.put('state',cartShipping.DeliverToState);
            dataMap.put('postal',cartShipping.DeliverToPostalCode);
            dataMap.put('country',cartShipping.DeliverToCountry);
            System.debug(dataMap);
            return dataMap; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    // getting the product item information which are in the cart
    @AuraEnabled(Cacheable=true)
    public static List<CartItem> getcartItems(string cartId) {
        List<CartItem> cs = [SELECT Id, Name, Sku,Quantity, SalesPrice,
        TotalListPrice from CartItem WHERE CartId=:cartId];
        return cs;     
    }

    // this method will save the address in the cart Delivery Group when save for future is not true
    @AuraEnabled
    public static Void cartDelivery(String name,String street,String city,String state,
                                String postal,String country,String cartId){
        try {
            CartDeliveryGroup cartShipping = [SELECT DeliverToName, DeliverToStreet, DeliverToCity, DeliverToState, 
                                        DeliverToPostalCode,DeliverToCountry 
                                        from CartDeliveryGroup where cartId=:cartId];
            cartShipping.DeliverToName = name;
            cartShipping.DeliverToStreet = street;
            cartShipping.DeliverToCity = city;
            cartShipping.DeliverToState = state;
            cartShipping.DeliverToPostalCode = postal;
            cartShipping.DeliverToCountry = country;
            update cartShipping;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Map<String,Object> getCartTotal(String cartId){
        try {
            WebCart crt = [SELECT Id, TotalTaxAmount,GrandTotalAmount,TotalChargeAmount,TotalProductAmount from WebCart WHERE Id=:cartId];
            Map<String,Object> dataMap = new Map<String,Object>();
            dataMap.put('tax',crt.TotalTaxAmount);
            dataMap.put('total',crt.GrandTotalAmount);
            dataMap.put('Ccost',crt.TotalChargeAmount);
            dataMap.put('stotal',crt.TotalProductAmount);
            return dataMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}

