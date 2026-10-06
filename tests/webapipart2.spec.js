const { test, expect } = require("@playwright/test");
let webContext;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("anshika@gmail.com");
  await page.locator("#userPassword").fill("Iamking@000");
  await page.locator("[value='Login']").click();
  await page.waitForURL("**/dashboard/**");
  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });  
});

test("Client App Login", async () => {
  const email = "anshika@gmail.com";
  const productName = "ZARA COAT 3";
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client");
  const products = page.locator(".card-body");
  await products.first().waitFor();
  const titles = await products.locator("b").allTextContents();
  console.log(titles);
  const count = await products.count();
  for (let i = 0; i < count; ++i) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      await products.nth(i).locator("text=Add To Cart").click();
      break;
    }
  }
  await page.locator("[routerlink*='cart']").click();
  await page.locator("div li").first().waitFor();
  const bool = await page.locator("h3:has-text('Zara Coat 3')").isVisible();
  expect(bool).toBeTruthy();
  await page.locator("text=Checkout").click();
  await page
    .locator("[placeholder*='Country']")
    .pressSequentially("ind", { delay: 150 });
  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();
  const optionsCount = await dropdown.locator("button").count();
  for (let i = 0; i < optionsCount; ++i) {
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text.trim() === "India") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }

  await expect(page.locator('.user__name [type="text"]').first()).toHaveText(
    email,
  );
  await page.locator(".action__submit").click();

  await expect(page.locator(".hero-primary")).toHaveText(
    " Thankyou for the order. ",
  );
  const orderIdRaw = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  const orderId = orderIdRaw.replace(/\|/g, "").trim(); // strip pipe characters, then trim
  console.log(orderId);

  await page.locator('button[routerlink*="myorders"]').click();
  await page.locator("tbody tr").first().waitFor();
  const rows = await page.locator("tbody tr");
  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (rowOrderId.trim() === orderId.trim()) {
      //await page.pause();
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  await page.locator(".email-title").waitFor({ state: "visible" });
  await expect(page.locator(".email-title")).toHaveText(" order summary ");
  //await page.pause();
});

test("Client App Login 1", async () => {
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client");

  const products = page.locator(".card-body");
  await products.first().waitFor();

  const titles = await products.locator("b").allTextContents();
  console.log(titles);
});
