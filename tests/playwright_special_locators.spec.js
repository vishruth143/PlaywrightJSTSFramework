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

    //5 seconds default timeout for expect assertions
    //You can override the default timeout with { timeout: <milliseconds> } at step level
    await expect(page.getByText('Success! The Form has been submitted successfully!')).toBeVisible({ timeout: 10_000});

    await page.getByRole('link', { name: 'Shop' }).click();
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();    
});

test('Playwright test level timeout', async ({page}) => {
    //Timeout hierarchy: Global -> Test level -> Step level -> Expect level

    test.setTimeout(60_000);
    const slowExpect = expect.configure({ timeout: 9_000 });
    page.setDefaultTimeout(9_000);
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

    //5 seconds default timeout for expect assertions
    //You can override the default timeout with { timeout: <milliseconds> } at step level
    await slowExpect(page.getByText('Success! The Form has been submitted successfully!')).toBeVisible();

    await page.getByRole('link', { name: 'Shop' }).click({timeout: 15_000});
    await page.locator('.my-4').first().waitFor();
    await slowExpect(page.locator(".my-4").first()).toHaveText('Shop Name');
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();   
});