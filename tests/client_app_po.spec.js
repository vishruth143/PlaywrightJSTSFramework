const { test, expect } = require("@playwright/test");
const { POManager } = require("../pageobjects/POManager");

test("Client App login", async ({ page }) => {
  const poManager = new POManager(page);
  //js file- Login js, DashboardPage
  const username = "anshika@gmail.com";
  const password = "Iamking@000";
  const productName = "ZARA COAT 3";

  const loginPage = poManager.getLoginPage();
  await loginPage.navigateToLoginPage();
  await loginPage.validLogin(username, password);

  const dashboardPage = poManager.getDashboardPage();
  await dashboardPage.searchProductAndAddToCart(productName);
  await dashboardPage.navigateToCart();

  const cartPage = poManager.getCartPage();
  await cartPage.verifyProductInCart(productName);
  await cartPage.checkout();

  const ordersReviewPage = poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");  
  const orderId = await ordersReviewPage.submitAndGetOrderId();
  console.log(orderId);

  await dashboardPage.navigateToOrders();

  const ordersHistoryPage = poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(orderId);
  expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();  
});
