public without sharing class B2b_NewShippingAddress {
    public B2b_NewShippingAddress() {

    }
    // this method is used to get the billing address of the contactPointAddress of account with
    // associated user
    @AuraEnabled
    public static List<ContactPointAddress> getBillingAddress(String userId){
        User cname = [SELECT Id, ContactId from User WHERE Id=:userId];
        Contact Cntname  = [SELECT Id, AccountId, Name from Contact WHERE Id=:cname.ContactId];
        try {
            List<ContactPointAddress> cntAddress = [SELECT Id,Name, City, State, PostalCode, Country,IsDefault
            from ContactPointAddress WHERE AddressType ='Billing' AND ParentId =:Cntname.AccountId];
            return cntAddress;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    //this method is used to add a new Shipping Address at the ContactPoint addrees for the logged in user
    @AuraEnabled
    public static ContactPointAddress newShippingAddress(String name,String street, String city, 
                                    String state,String postalCode,String country, String userId,Boolean Isdef){
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
// this method is used for getting the shipping address of contactpoint address of a Account with
// associated user
    @AuraEnabled
    public static List<ContactPointAddress> getShippingAddress(String userId){
        User cname = [SELECT Id, ContactId from User WHERE Id=:userId];
        Contact Cntname  = [SELECT Id, AccountId, Name from Contact WHERE Id=:cname.ContactId];
        try {
            List<ContactPointAddress> shipAddress = [SELECT Id,Name,Street, City, State, PostalCode, Country,IsDefault
            from ContactPointAddress WHERE AddressType ='Shipping' AND ParentId =:Cntname.AccountId];
            return shipAddress;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    //by passing a label as a parameter in this method getting the Id of the Selected address
    // where Label is the address selected by the user at the shipping and billing page of checkout
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

    //updating the billing address in the cart when the user select a billing address
    // by passing BillingAddressId and cart Id As a parameter
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

    // in this method I am getting the saved Billing Address of the cart using the cartId
    // and Storing in a map-- used at the order review page 
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
    // used at the Order review Page
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
    // get the Saved address for the CartDelivery Group to show at the order Review Page
    @AuraEnabled
    public static Map<String,Object> getShip(String cartId){
        try {
            CartDeliveryGroup cartShipping = [SELECT DeliverToName, DeliverToStreet, DeliverToCity, 
            DeliverToState, DeliverToPostalCode,DeliverToCountry from CartDeliveryGroup where cartId=:cartId];
            
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
    // Total price of the current cart;
    @AuraEnabled
    public static Map<String,Object> getCartTotal(String cartId){
        try {
            WebCart cartPrice = [SELECT Id, TotalTaxAmount,GrandTotalAmount,TotalChargeAmount,TotalProductAmount from WebCart WHERE Id=:cartId];
            Map<String,Object> dataMap = new Map<String,Object>();
            dataMap.put('TaxAmount',cartPrice.TotalTaxAmount);
            dataMap.put('totalAmount',cartPrice.GrandTotalAmount);
            dataMap.put('Ccost',cartPrice.TotalChargeAmount);
            dataMap.put('stotal',cartPrice.TotalProductAmount);
            return dataMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    // it will Update the CartDelivery Group address when the SaveforFuture is not true;
    @AuraEnabled
    public static String orderShippingAddress(String name,String street, String city,
    String state,String postalCode,String country, String cartId )
    {
        try 
        {
            CartDeliveryGroup cdcart = [SELECT DeliverToAddress,DeliverToState,DeliverToCity,DeliverToPostalCode
            ,DeliverToStreet, DeliverToCountry, DeliverToName FROM CartDeliveryGroup WHERE CartId =: cartId];
            cdcart.DeliverToCity = city;
            cdcart.DeliverToPostalCode=postalCode;
            cdcart.DeliverToStreet = street;
            cdcart.DeliverToState =  state;
            cdcart.DeliverToCountry = country;
            cdcart.DeliverToName = name;
            String returnAddress = name + ' ' + street +' '+city +' '+state+' '+ postalCode + ' ' + country;
            update cdcart;
            return returnAddress;
        }
         catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}

