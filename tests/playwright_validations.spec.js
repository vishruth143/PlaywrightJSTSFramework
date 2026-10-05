const { test, expect } = require("@playwright/test");
test.describe("Automation Practice", () => {
  test("Browser navigations", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.goto("https://www.google.com/");
    await page.goBack();
    await page.goForward();
  });

  test("Dropdown Example", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.locator("#dropdown-class-example").selectOption("option2");
  });

  test("Suggession Class Example", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page
      .locator("#autocomplete")
      .pressSequentially("Ind", { delay: 150 });
    const dropdown = page.locator(".ui-menu-item");
    await dropdown.first().waitFor();
    const optionsCount = await dropdown
      .locator(".ui-menu-item-wrapper")
      .count();
    console.log(optionsCount);
    for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown
        .locator(".ui-menu-item-wrapper")
        .nth(i)
        .textContent();
      if (text.trim() === "India") {
        await dropdown.locator(".ui-menu-item-wrapper").nth(i).click();
        break;
      }
    }
  });

  test("Element Displayed Example", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
  });

  test("Switch To Alert Example", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.locator("#alertbtn").click();
    await page.on("dialog", (dialog) => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.on("dialog", (dialog) => dialog.dismiss());
  });

  test("Mouse Hover Example", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.locator("#mousehover").hover();
    await page.locator(".mouse-hover-content").nth(0).click();
  });

  test("iFrame Example", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1].split(" ")[0]);
  });

  test("Switch Tab Example", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    const [newPage] = await Promise.all([
      page.context().waitForEvent("page"),
      page.locator("#opentab").click(),
    ]);
    await newPage.waitForLoadState();
    console.log(await newPage.title());
  });

  test("Switch Window Example", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    const [newPage] = await Promise.all([
      page.context().waitForEvent("page"),
      page.locator("#openwindow").click(),
    ]);
    await newPage.waitForLoadState();
    console.log(await newPage.title());
  });

  test("Switch Tab Example1", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    const pagePromise = page.context().waitForEvent("page");
    await page.locator("#opentab").click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    console.log(await newPage.title());
  });

  test("Radio Button Example", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.locator("#radio-btn-example .radioButton").nth(1).click();
    await page.getByRole("radio").nth(0).check();
    await expect(page.getByRole("radio").nth(0)).toBeChecked();
  });

  test("Checkbox Example", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    // await page.locator('#checkbox-example [type="checkbox"]').nth(0).check();
    // await page.locator('#checkbox-example [type="checkbox"]').nth(1).check();
    // await page.locator('#checkbox-example [type="checkbox"]').nth(2).check();
    const checkboxes = page.getByRole("checkbox");
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();

    await expect(checkboxes.nth(0)).toBeChecked();
    await expect(checkboxes.nth(1)).toBeChecked();
    await expect(checkboxes.nth(2)).toBeChecked();
  });
});
