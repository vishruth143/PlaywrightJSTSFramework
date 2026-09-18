const {test, expect} = require('@playwright/test');

test('Page Playwrigth test', async ({page}) => {

    const emailTxt = page.locator('#userEmail');
    const passwordTxt = page.locator('#userPassword');    
    const loginBtn = page.locator('#login');
    const cards = page.locator('.card-body b');
   

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login", 
        {
            waitUntil: 'domcontentloaded',   // don't wait for full 'load' — faster, less timeout-prone
            timeout: 60000                   // bump nav timeout for flaky third-party sites
       });    
    console.log(await page.title());
    await emailTxt.fill('dummywebsite@rahulshettyacademy.com');
    await passwordTxt.fill('test@1234');
    await loginBtn.click(); 
    // await page.waitForLoadState('networkidle');
    await expect(cards.first()).toBeVisible();
    const allCards = await cards.allTextContents();
    console.log(allCards);
});

test('Dropdown Playwright test', async ({page}) => {
    const roleDropdown = page.locator('select.form-control');
    const adminRadioBtn = page.locator('.radiotextsty').first();
    const userRadioBtn = page.locator('.radiotextsty').last();
    // const adminRadioBtn = page.locator('.radiotextsty').nth(0);
    // const userRadioBtn = page.locator('.radiotextsty').nth(1);
    const popupCancelBtn = page.locator('#cancelBtn');
    const popupOkayBtn = page.locator('#okayBtn');
    const termsCheckbox = page.locator('#terms');
    const documentLink = page.locator('a[href*="documents-request"]');

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/", 
        {
            waitUntil: 'domcontentloaded',   // don't wait for full 'load' — faster, less timeout-prone
            timeout: 60000                   // bump nav timeout for flaky third-party sites
       });
    console.log(await page.title());
    await userRadioBtn.check();
    await expect(userRadioBtn).toBeChecked();
    console.log(await userRadioBtn.isChecked());
    await popupOkayBtn.click();
    await roleDropdown.selectOption('Consultant');
    // await page.pause();
    await termsCheckbox.check();
    await expect(termsCheckbox).toBeChecked();
    console.log(await termsCheckbox.isChecked());
    await termsCheckbox.uncheck();    
    await expect(termsCheckbox).not.toBeChecked();
    console.log(await termsCheckbox.isChecked());
    expect(await termsCheckbox.isChecked()).toBeFalsy();

    await expect(documentLink).toHaveAttribute('class', 'blinkingText');
});

test('Child Window Handling', async ({browser}) => {    
    const context = await browser.newContext();
    const page = await context.newPage();
    const userNameTxt = page.locator('#username');
    const documentLink = page.locator('a[href*="documents-request"]');

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/", 
        {
            waitUntil: 'domcontentloaded',   // don't wait for full 'load' — faster, less timeout-prone
            timeout: 60000                   // bump nav timeout for flaky third-party sites
       });
    console.log(await page.title());    
    const [newPage] = await Promise.all([
        context.waitForEvent('page'), //Listen for the new page pending, rejected and fulfilled
        documentLink.click({ force: true }) //New page is opened
    ]);    
    const text = await newPage.locator('.red').textContent();
    const domain = text.split('@')[1].split(' ')[0];
    console.log(text);
    console.log(domain);
    await userNameTxt.fill(domain);
    console.log(await userNameTxt.inputValue());
});

test('Client App-E2E Flow', async ({page}) => {    
    const emailTxt = page.locator('#userEmail');
    const passwordTxt = page.locator('#userPassword');    
    const loginBtn = page.locator('#login');

    const products = page.locator('.card-body');
    const productName = "ZARA COAT 3";
    const cartBtn = page.locator('[routerlink*="cart"]');
    const email = 'dummywebsite@rahulshettyacademy.com';
   

    await page.goto("https://rahulshettyacademy.com/client", 
        {
            waitUntil: 'domcontentloaded',   // don't wait for full 'load' — faster, less timeout-prone
            timeout: 60000                   // bump nav timeout for flaky third-party sites
       });
    console.log(await page.title());
    await emailTxt.fill(email);
    await passwordTxt.fill('test@1234');
    await loginBtn.click(); 
    await products.first().waitFor();
    const allProducts = await products.allTextContents();
    console.log(allProducts);
    const count = await products.count();
    console.log(count); 
    for(let i=0; i<count; ++i){
       if(await products.nth(i).locator("b").textContent() === productName) {
           await products.nth(i).locator("text=Add To Cart").click();
           break;
       }
    }
    await cartBtn.click();
    //await page.pause();
    await page.locator('div li').first().waitFor();

    const bool = page.locator('h3:has-text("ZARA COAT 3")').isVisible();
    expect(bool).toBeTruthy();

    await page.locator('text=Checkout').click();
    await page.locator("[placeholder*='Country']").pressSequentially("ind", {delay: 150});
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator('button').count();
    for(let i=0; i < optionsCount; ++i){
        const text = await dropdown.locator("button").nth(i).textContent();
        if(text.trim() === "India"){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    await expect(page.locator('.user__name [type="text"]').first()).toHaveText(email);
    await page.locator('.action__submit').click();


    await expect(page.locator('.hero-primary')).toHaveText(" Thankyou for the order. ");
    const orederIdRaw = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    const orederId = orederIdRaw.replace(/\|/g, '').trim();   // strip pipe characters, then trim
    console.log(orederId);

    await page.locator('button[routerlink*="myorders"]').click();
    await page.locator('tbody tr').first().waitFor();
    const rows = await page.locator('tbody tr');
    for (let i=0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator('th').textContent();        
        if(rowOrderId.trim() === orederId.trim()){    
            //await page.pause();                   
            await rows.nth(i).locator('button').first().click();
            break;
        }
    }
    await page.locator('.email-title').waitFor({ state: 'visible' });
    await expect(page.locator('.email-title')).toHaveText(" order summary ");
    //await page.pause();
});