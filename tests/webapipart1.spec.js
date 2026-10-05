const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');

const loginPayLoad = { userEmail: "anshika@gmail.com",  userPassword: "Iamking@000" };
const orderPayLoad = {orders: [{country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68"}]};

let response;

test.beforeAll( async () => {
   const apiContext = await request.newContext();    
   const apiUtils = new APIUtils(apiContext, loginPayLoad);
   response = await apiUtils.createOrder(orderPayLoad);
});

test('Client App login and place order', async ({ page }) => { 
   page.addInitScript( value => {
      window.localStorage.setItem('token', value);
   }, response.token );

   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator('button[routerlink*="myorders"]').click();
   await page.locator('tbody tr').first().waitFor();
   const rows = await page.locator('tbody tr');
   for (let i=0; i < await rows.count(); ++i) {
       const rowOrderId = await rows.nth(i).locator('th').textContent();        
       if(response.orderId.includes(rowOrderId.trim())){    
           //await page.pause();                   
           await rows.nth(i).locator('button').first().click();
           break;
       }
   }
   await page.locator('.email-title').waitFor({ state: 'visible' });
   await expect(page.locator('.email-title')).toHaveText(" order summary ");
   //await page.pause();
});