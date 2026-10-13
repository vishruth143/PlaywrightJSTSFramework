const { Given, When, Then } = require('@cucumber/cucumber');

Given('User login to Ecommerce application with {string} and {string}', async function (username, password) {
  // Implement login functionality here
  
});

When('Add {string} to cart', async function (product) {
  // Implement add to cart functionality here
});

Then('Verify {string} is displayed in the cart', async function (product) {
  // Implement verification of product in cart here
});

When('User enters valid details and place the order', async function () {
  // Implement placing the order functionality here
});

Then('Verify order is present in order history', async function () {
  // Implement verification of order in order history here
});