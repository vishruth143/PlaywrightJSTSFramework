const {
  Before,
  After,
  BeforeStep,
  AfterStep,
  Status,
} = require("@cucumber/cucumber");
const { POManager } = require("../../pageobjects/POManager");
const playwright = require("@playwright/test");

Before(
  { tags: "@regression or @smoke or @sanity or @error_validation" },
  async function () {
    const browser = await playwright.chromium.launch({ headless: false });
    const context = await browser.newContext();
    this.page = await context.newPage();
    this.poManager = new POManager(this.page);
  },
);

BeforeStep(async function () {});

AfterStep(async function ({ result }) {
  if (result.status === "FAILED") {
    await this.page.screenshot({ path: `screenshots/${Date.now()}.png` });
  }
});

After(
  { tags: "@regression or @smoke or @sanity or @error_validation" },
  async function () {
    console.log("This is last to execute");
  },
);
