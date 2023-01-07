public with sharing class B2bTestInventory {
    public B2bTestInventory() {

    }
    @AuraEnabled(cacheable=true)
    public static ConnectApi.ProductDetail getProduct(
        String communityId, String productId, String effectiveAccountId){
            String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);
            return ConnectApi.CommerceCatalog.getProduct(
                webstoreId,
                productId,
                effectiveAccountID,
                null,
                false,
                null,
                false,
                true,
                false
              );
    }
    @AuraEnabled(cacheable=true)
    public static Boolean checkProductStock(String productId){
        try{
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            String endpoint =
            'https://training202104--fkhan.sandbox.my.salesforce.com/services/apexrest/B2B_Inventory__c/' + productId;
            request.setEndpoint(endpoint);
            request.setMethod('GET');
            request.setHeader('Authorization', 'Bearer '+UserInfo.getSessionID());
            HttpResponse response = http.send(request);
            // If the request is successful, parse the JSON response.

            if (response.getStatusCode() == 200) {
              // Deserialize the JSON string into collections of primitive data types.
              Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(
                response.getBody()
              );
              return (Boolean)results.get('Available_For_Purchase__c');
            } 
            else {
              return false;
            }
          }
          catch(Exception e){
            throw new AuraHandledException('there is no Associated Inventory for this Product' + e.getMessage());
          } 
    }
}
