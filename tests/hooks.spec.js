const { test, expect } = require("@playwright/test");

test.beforeAll(async () => {
  console.log("Once before all tests");
});

test.beforeEach(async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client");
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach("failure-screenshot", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  }
});

test.afterAll(async () => {
  console.log("Once after all tests");
});

test.describe("Playwright Hooks Practice", () => {
  test("test 1", async ({ page }) => {
    await expect(page).toHaveTitle(/Let's Shop/);
  });

  test("test 2", async ({ page }) => {
    await expect(page.locator("#userEmail")).toBeVisible();
  });
});
