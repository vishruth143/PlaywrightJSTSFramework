import { test, expect } from '@playwright/test';

test('Playwright Special locators', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice", 
        {
            waitUntil: 'domcontentloaded',   // don't wait for full 'load' — faster, less timeout-prone
            timeout: 60000                   // bump nav timeout for flaky third-party sites
       });
    await page.getByLabel('Check me out if you Love IceCreams!').click();
    await page.getByLabel('Employed').check();
    await page.getByLabel('Gender').selectOption('Female');
    await page.getByPlaceholder('Password').fill('abc123');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByText('Success! The Form has been submitted successfully!').isVisible();
    await page.getByRole('link', { name: 'Shop' }).click();
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();    
});