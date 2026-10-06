const { expect } = require("@playwright/test");
const { customtest } = require("../utils/fixtures.js");

customtest(
  "Fixtures demo",
  async ({ authenticatedPage, createOrder, testDataForOrder }) => {
    await authenticatedPage.goto("https://rahulshettyacademy.com/client");
    await authenticatedPage.locator('button[routerlink*="myorders"]').click();
    await authenticatedPage.locator("tbody tr").first().waitFor();
    await expect(
      authenticatedPage.getByText(createOrder.orderId),
    ).toBeVisible();
    console.log(testDataForOrder.productName);
  },
);
