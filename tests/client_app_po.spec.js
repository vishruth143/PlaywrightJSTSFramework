const { test, expect } = require("@playwright/test");
const { POManager } = require("../pageobjects/POManager");
const dataSet = require("../utils/placeOrderTestData.json");

for (const data of dataSet) {
  /** @priority P0 @owner vishvambruth @feature checkout */
  test(`Client App login for the product    - ${data.productName}`, async ({ page }) => {
    const poManager = new POManager(page);
    //js file- Login js, DashboardPage
    const username = data.username;
    const password = data.password;
    const productName = data.productName;

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
}
