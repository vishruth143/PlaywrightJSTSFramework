const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

Given(
  "User login to Ecommerce application with {string} and {string}",
  { timeout: 100 * 1000 },
  async function (username, password) {
    // Implement login functionality here    
    const loginPage = this.poManager.getLoginPage();
    await loginPage.navigateToLoginPage();
    await loginPage.validLogin(username, password);
  },
);

When("Add {string} to cart", async function (productName) {
  // Implement add to cart functionality here
  this.dashboardPage = this.poManager.getDashboardPage();
  await this.dashboardPage.searchProductAndAddToCart(productName);
  await this.dashboardPage.navigateToCart();
});

Then("Verify {string} is displayed in the cart", async function (productName) {
  // Implement verification of product in cart here
  const cartPage = this.poManager.getCartPage();
  await cartPage.verifyProductInCart(productName);
  await cartPage.checkout();
});

When("User enters valid details and place the order", async function () {
  // Implement placing the order functionality here
  const ordersReviewPage = this.poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");
  this.orderId = await ordersReviewPage.submitAndGetOrderId();
  console.log(this.orderId);
});

Then("Verify order is present in order history", async function () {
  // Implement verification of order in order history here
  await this.dashboardPage.navigateToOrders();

  const ordersHistoryPage = this.poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(this.orderId);
  expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});

Given(
  "User login to Ecommerce2 application with {string} and {string}",
  { timeout: 100 * 1000 },
  async function (username, password) {

    const userNameTxt = this.page.locator("#username");
    const passwordTxt = this.page.locator("#password");
    const signInBtn = this.page.locator("#signInBtn");

    // Implement login functionality here    
    await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");    
    console.log(await this.page.title());

    await userNameTxt.fill(username);
    await passwordTxt.fill(password);
    await signInBtn.click();


  });

Then("Verify error message is displayed", async function () {
  console.log(await this.page.locator("[style*='block']").textContent());
  await expect(this.page.locator("[style*='block']")).toContainText("Incorrect username/password.");
});
