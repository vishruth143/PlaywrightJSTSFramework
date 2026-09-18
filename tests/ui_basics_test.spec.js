const {test, expect} = require('@playwright/test');

test('Browser Context Playwrigth test', async ({browser}) => {
    //Chrome - Plugins / Cookies
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractice/", 
        {
            waitUntil: 'domcontentloaded',   // don't wait for full 'load' — faster, less timeout-prone
            timeout: 60000                   // bump nav timeout for flaky third-party sites
       });
    console.log(await page.title());
    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator('#password').fill('Learning@830$3mK2');
    await page.locator("#terms").check();
    await page.locator('#signInBtn').click();
});

test('Page Playwrigth test', async ({page}) => {
    await page.goto("https://www.google.com/");
    console.log(await page.title());
    await expect(page).toHaveTitle(/Google/);
});

test('Empty "Username" validation', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractice/");
    console.log(await page.title());
    await page.locator('#signInBtn').click();
    await page.locator("[style*='block']").isVisible();    
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Empty username/password.');
});

test('Valid login test', async ({page}) => {
    const userNameTxt = page.locator('#username');
    const passwordTxt = page.locator('#password');
    const termsChk = page.locator('#terms');
    const signInBtn = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-body a");

    await page.goto("https://rahulshettyacademy.com/loginpagePractice/", 
        {
            waitUntil: 'domcontentloaded',   // don't wait for full 'load' — faster, less timeout-prone
            timeout: 60000                   // bump nav timeout for flaky third-party sites
       });
    console.log(await page.title());

    await userNameTxt.fill('rahulshettyacademy');
    await passwordTxt.fill('Learning@830$3mK2');

    await termsChk.check();

    await signInBtn.click();

    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(0).textContent());
    console.log(await cardTitles.nth(1).textContent());
    console.log(await cardTitles.nth(2).textContent());
    console.log(await cardTitles.nth(3).textContent());
    console.log(await cardTitles.last().textContent());

    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
});