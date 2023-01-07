@RestResource(urlMapping='/B2B_Inventory__c/*')
global with Sharing class InventoryService {
        @HttpGet
        global static B2B_Inventory__c getInventory(){
            
            RestRequest request = RestContext.request;
            String InventoryId = request.requestURI.substring(
            request.requestURI.lastIndexOf('/')+1);
            
            //Product2 ps = [select Id from Product2];
            //B2B_Inventory__c psku = [select Id, Product_Item__r.Product2.StockKeepingUnit from B2B_Inventory__c];
            try{
                B2B_Inventory__c result = [SELECT Id, Available_For_Purchase__c FROM B2B_Inventory__c WHERE Product_Items__c =:InventoryId];
                return result; 
            }
            catch(Exception e){
                throw new AuraHandledException('There is no Available QTY Specified' + e.getMessage());
            }
               
        } 
        @HttpPut
        global static Decimal reserveInventory(String id, Decimal reserved){
            B2B_Inventory__c rs = new B2B_Inventory__c(Id = id,Reserved__c = reserved);
            upsert rs;
            return rs.Reserved__c;
            //return bs.Id;
        
        } 
        @HttpPatch
        global static Decimal committedInventory(){
            RestRequest request = RestContext.request;
            String InventoryId = request.requestURI.substring(
                request.requestURI.lastIndexOf('/')+1);
            B2B_Inventory__c updateInv = [SELECT Committed__c FROM B2B_Inventory__c WHERE Id=:InventoryId];
            Map<String, Object> params = (Map<String, Object>)JSON.deserializeUntyped(request.requestbody.tostring());
            for(String fieldName : params.keySet()) {
                updateInv.put(fieldName, params.get(fieldName));
            }
            update updateInv;
            return updateInv.Committed__c;
            
            
     }

}