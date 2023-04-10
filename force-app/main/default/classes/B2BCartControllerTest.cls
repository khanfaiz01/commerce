@isTest
private with sharing class B2BCartControllerTest {
    @isTest
    static void TestGetcartItems(){
        //create  test data
        Account a  = new Account(Name='Test Account');
        insert a;
        ConnectApi.Cart crt = ConnectApi.CommerceCart.createCart('webStoreId',a.Id);
        ConnectApi.Product pdt = ConnectApi.CommerceCatalog.getProduct('webstoreId', 'productId');
        ConnectApi.CartItem cItem = ConnectApi.CommerceCart.addProduct(crt.Id,pdt.Id,1);
        insert cItem;
        // Test the method
        ConnectApi.CartItemCollection cartItems = getCartItems(
            'CommunityId',a.Id,crt.Id,'0','NameAsc'
        );
        //Assert the Result
        Test.startTest();
        System.assertNotEqual(null,cartItems,'Expected a non-null cartCollection');
        System.assertEqual(1,cartItems.items.size(),'Expected only one Item in the cart');
        Test.stopTest();
    }
}