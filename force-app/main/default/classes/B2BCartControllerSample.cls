/**
 * @description Demonstrates how to make Apex calls to ConnectApi.CommerceCart class
 * to perform Cart Operations for B2B Commerce on Lightning.
 *
 * @see B2BUtils
 */
public with sharing class B2BCartControllerSample {
  /**
   * @description Demonstrates how to call ConnectApi.CommerceCart.getCartItems
   * @param  communityId The Id of the community from which the call originated
   * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
   * @param activeCartOrId ID of the cart, active, or current.
   * @param pageParam Specifies the page token to be used to view a page of information.
   * @param sortParam Sort order for items in a cart.
   * @return CartItemCollection A collection of cart items
   */
  @AuraEnabled
  public static ConnectApi.CartItemCollection getCartItems(
    String communityId,
    String effectiveAccountId,
    String activeCartOrId,
    String pageParam,
    String sortParam
  ) {
    // Lookup the webstore ID associated with the community
    String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);

    // Get the ConnectApi.CartItemSortOrder enum value from string.
    // For the list of possible values, see:
    // see https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/connectAPI_enums.htm#cartItemSortOrderEnum
    ConnectApi.CartItemSortOrder resolvedSortParam = B2BUtils.resolveSortParam(
      sortParam
    );

    // For more details, see:
    // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
    return ConnectApi.CommerceCart.getCartItems(
      webstoreId,
      effectiveAccountId,
      activeCartOrId,
      pageParam,
      resolvedSortParam
    );
  }

  /**
   * @description Demonstrates how to call ConnectApi.CommerceCart.updateCartItem
   * @param  communityId The Id of the community from which the call originated
   * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
   * @param activeCartOrId ID of the cart, active, or current.
   * @param cartItemId ID of the cart item to be updated.
   * @return CartItem The updated cart item
   */
  @AuraEnabled
  public static ConnectApi.CartItem updateCartItem(
    String communityId,
    String effectiveAccountId,
    String activeCartOrId,
    String cartItemId,
    ConnectApi.CartItemInput cartItem
  ) {
    // Lookup the webstore ID associated with the community
    String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);

    // For more details, see:
    // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
    return ConnectApi.CommerceCart.updateCartItem(
      webstoreId,
      effectiveAccountId,
      activeCartOrId,
      cartItemId,
      cartItem
    );
  }

  /**
   * @description Demonstrates how to call ConnectApi.CommerceCart.deleteCartItem
   * @param  communityId The Id of the community from which the call originated
   * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
   * @param activeCartOrId ID of the cart, active, or current.
   * @param cartItemId ID of the cart item to be deleted.
   */
  @AuraEnabled
  public static void deleteCartItem(
    String communityId,
    String effectiveAccountId,
    String activeCartOrId,
    String cartItemId
  ) {
    // Lookup the webstore ID associated with the community
    String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);

    // For more details, see:
    // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
    ConnectApi.CommerceCart.deleteCartItem(
      webstoreId,
      effectiveAccountId,
      activeCartOrId,
      cartItemId
    );
  }

  /**
   * @description Demonstrates how to call ConnectApi.CommerceCart.getCartSummary
   * @param  communityId The Id of the community from which the call originated
   * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
   * @param activeCartOrId ID of the cart, active, or current.
   */
  @AuraEnabled
  public static ConnectApi.CartSummary getCartSummary(
    String communityId,
    String effectiveAccountId,
    String activeCartOrId
  ) {
    // Lookup the webstore ID associated with the community
    String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);

    // For more details, see:
    // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
    return ConnectApi.CommerceCart.getCartSummary(
      webstoreId,
      effectiveAccountId,
      activeCartOrId
    );
  }

  /**
   * @description Demonstrates how to call ConnectApi.CommerceCart.createCart
   * @param  communityId The Id of the community from which the call originated
   * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
   */
  @AuraEnabled
  public static ConnectApi.CartSummary createCart(
    String communityId,
    String effectiveAccountId
  ) {
    // Lookup the webstore ID associated with the community
    String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);
    ConnectApi.CartInput cartInput = new ConnectApi.CartInput();
    cartInput.effectiveAccountId = effectiveAccountId;
    // For more details, see:
    // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
    return ConnectApi.CommerceCart.createCart(webstoreId, cartInput);
  }

  /**
   * @description Demonstrates how to call ConnectApi.CommerceCart.deleteCart
   * @param  communityId The Id of the community from which the call originated
   * @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
   * @param activeCartOrId ID of the cart, active, or current.
   */
  @AuraEnabled
  public static void deleteCart(
    String communityId,
    String effectiveAccountId,
    String activeCartOrId
  ) {
    // Lookup the webstore ID associated with the community
    String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(communityId);

    // For more details, see:
    // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_CommerceCart_static_methods.htm
    ConnectApi.CommerceCart.deleteCart(
      webstoreId,
      effectiveAccountId,
      activeCartOrId
    );
  }
  /////////////////////////////////////////////////////////////////
  // this method used for the  rerserved inventory update
  @AuraEnabled(cacheable=true)
  public static Void reservedInvCheckOut(String sku, Decimal reservedQuantity, String productId){
    Map<String, Object> getdatamp = B2BGetInfo.getInventroyData(productId);
    Decimal oldReservedQty = (Decimal)getdatamp.get('Reserved__c');
    if(oldReservedQty!=null)
    {
    reservedQuantity += oldReservedQty;
    }
    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setEndpoint(Url.getOrgDomainUrl().toExternalForm() + '/services/apexrest/B2B_Inventory__c/'+sku);
    request.setBody('{"Reserved__c":'+reservedQuantity+'}');
    request.setMethod('PATCH');
    request.setHeader('Authorization','Bearer '+UserInfo.getSessionId());
    request.setHeader('Content-Type', 'application/json');
    HttpResponse response = http.send(request);
  }

  //------------------this method has been used in clear cart ----------------------
  @AuraEnabled(cacheable=true)
  public static Void reservedInvClearCart(String sku, Decimal reservedQuantity, String productId){
    Map<String, Object> getdatamp = B2BGetInfo.getInventroyData(productId);
    Decimal oldReservedQty = (Decimal)getdatamp.get('Reserved__c');
    if(oldReservedQty!=null)
    {
    reservedQuantity = oldReservedQty -reservedQuantity;
    } 
    // Decimal reservedQuantity = 0;
    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setEndpoint(Url.getOrgDomainUrl().toExternalForm() + '/services/apexrest/B2B_Inventory__c/'+sku);
    request.setBody('{"Reserved__c":'+reservedQuantity+'}');
    request.setMethod('PATCH');
    request.setHeader('Authorization','Bearer '+UserInfo.getSessionId());
    request.setHeader('Content-Type', 'application/json');
    HttpResponse response = http.send(request);
    System.debug(response);
  }


  @AuraEnabled
  public static LIST<CartItem> getSKU(String cartID){
    try {
      List<CartItem> skuList = [SELECT sku,quantity,product2Id from CartItem where CartId =: cartID];
      for(Integer i = 0 ; i < skuList.Size(); i++)
      {
        String tempSKU = String.valueOf(skuList[i].sku);
        Decimal qty = skuList[i].quantity;
        String productId = skuList[i].product2Id;
        reservedInvClearCart(tempSKU,qty,productId);
      }
      return skuList;
      
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
//////-------------------------------------when user clicked on cross button-------------------
  @AuraEnabled(cacheable=true)
  public static Void InvCrossCart(Map<String,Object> mp)
  {
    String sku = String.valueOf(mp.get('sku'));
    Decimal reservedQuantity = (Decimal)mp.get('qty');
    String productId = String.valueOf(mp.get('productId'));

    Map<String, Object> getdatamp = B2BGetInfo.getInventroyData(productId);
    Decimal oldReservedQty = (Decimal)getdatamp.get('Reserved__c');
    if(oldReservedQty!=null)
    {
    reservedQuantity = oldReservedQty -reservedQuantity;
    } 
    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setEndpoint(Url.getOrgDomainUrl().toExternalForm() + '/services/apexrest/B2B_Inventory__c/'+sku);
    request.setBody('{"Reserved__c":'+reservedQuantity+'}');
    request.setMethod('PATCH');
    request.setHeader('Authorization','Bearer '+UserInfo.getSessionId());
    request.setHeader('Content-Type', 'application/json');
    HttpResponse response = http.send(request);
    System.debug(response);
  }
  
  @AuraEnabled
  public static Map<String,Object> getcartitemId(String cartItemId, Boolean crossHandle){
    try {
      cartItem crtItem = [SELECT sku,quantity,product2Id from cartItem where Id=:cartItemId LIMIT 1];
      Map<String,Object> dataMap = new Map<String,Object>();
      dataMap.put('sku',crtItem.sku);
      dataMap.put('productId',crtItem.product2Id);
      dataMap.put('qty',crtItem.quantity);
      if(crossHandle)
      {
        InvCrossCart(dataMap);
      }
      return dataMap;

      
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}