public class B2bCommittedInv {
    public B2bCommittedInv() {

    }
    @InvocableMethod(callout=true label='OrderSummaryId' Description='it will receive orderSummaryId')
    public static void committedInventory(List<Id> orderSummaryId){
        List<OrderItemSummary> orderItems = [SELECT Id, OrderSummaryId, Quantity, StockKeepingUnit, 
                            Product2Id FROM OrderItemSummary WHERE OrderSummaryId =:orderSummaryId];
            for(OrderItemSummary ordsId : orderItems)
            {
                String sku = ordsId.StockKeepingUnit;
                if(sku!=null)
                {
                    Decimal newCommittedQty;
                    String productId = ordsId.Product2Id;
                    Map<String, Object> resultData = B2BGetInfo.getInventroyData(productId);
                    Decimal oldCommittedQty = (Decimal)resultData.get('Committed__c');
                    if(oldCommittedQty!=null)
                    {
                        newCommittedQty = oldCommittedQty + ordsId.Quantity;
                    }
                    else {
                        newCommittedQty = ordsId.Quantity;
                    }
                    Decimal oldReservedQuantity = (Decimal)resultData.get('Reserved__c');
                    Decimal newReservedQuantity = oldReservedQuantity - ordsId.Quantity;
                    Http http = new Http();
                    HttpRequest request = new HttpRequest();
                    request.setEndpoint(Url.getOrgDomainUrl().toExternalForm() + '/services/apexrest/B2B_Inventory__c/'+sku);
                    request.setBody('{"Reserved__c":'+newReservedQuantity+',"Committed__c":'+newCommittedQty+'}');
                    request.setMethod('PATCH');
                    request.setHeader('Authorization','Bearer '+UserInfo.getSessionId());
                    request.setHeader('Content-Type', 'application/json');
                    HttpResponse response = http.send(request);
    
                }
      }
    }
}
