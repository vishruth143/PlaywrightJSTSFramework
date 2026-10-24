
Feature: Ecommerce Validations
  @regression @smoke @sanity
  Scenario: Placing the order
    Given User login to Ecommerce application with "ashika@gmail.com" and "Iamking@000"
    When Add "ZARA COAT 3" to cart   
    Then Verify "ZARA COAT 3" is displayed in the cart
    When User enters valid details and place the order
    Then Verify order is present in order history