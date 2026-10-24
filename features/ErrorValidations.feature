Feature: Ecommerce Validations
  @error_validation
  Scenario: Placing the order
    Given User login to Ecommerce2 application with "ashika@gmail.com" and "Iamking@000"
    Then Verify error message is displayed