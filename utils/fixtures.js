const { test, request } = require('@playwright/test');
const { APIUtils } = require("../utils/apiUtils.js");

const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }]};


exports.customtest = test.extend({
    authenticatedPage: async ({ browser }, use) => {
        //Setup
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("https://rahulshettyacademy.com/client");
        await page.locator("#userEmail").fill("anshika@gmail.com");
        await page.locator("#userPassword").fill("Iamking@000");
        await page.locator("[value='Login']").click();
        await page.waitForURL('**/dashboard/**');

        await use(page);
        //Tear Down
        await context.close();
    },
    createOrder: async ({}, use) => {
        //Setup
        const apiContext = await request.newContext();
        const apiUtils = new APIUtils(apiContext, loginPayLoad);
        let response = await apiUtils.createOrder(orderPayLoad);
        await use(response);
        //Tear Down
        await apiContext.dispose();
    },
    testDataForOrder: {
        productName: "ZARA COAT 3"
    } 
});