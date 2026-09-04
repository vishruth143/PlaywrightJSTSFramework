const {test, expect} = require('@playwright/test');

test('Page Playwrigth test', async ({page}) => {

    const emailTxt = page.locator('#userEmail');
    const passwordTxt = page.locator('#userPassword');    
    const loginBtn = page.locator('#login');
    const cards = page.locator('.card b');
   

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    await emailTxt.fill('dummywebsite@rahulshettyacademy.com');
    await passwordTxt.fill('test@1234');
    await loginBtn.click(); 
    // await page.waitForLoadState('networkidle');
    await cards.first().waitFor();
    const allCards = await cards.allTextContents();
    console.log(allCards);
});

test.only('Dropdown Playwright test', async ({page}) => {
    const roleDropdown = page.locator('select.form-control');
    const adminRadioBtn = page.locator('.radiotextsty').first();
    const userRadioBtn = page.locator('.radiotextsty').last();
    // const adminRadioBtn = page.locator('.radiotextsty').nth(0);
    // const userRadioBtn = page.locator('.radiotextsty').nth(1);
    const popupCancelBtn = page.locator('#cancelBtn');
    const popupOkayBtn = page.locator('#okayBtn');
    const termsCheckbox = page.locator('#terms');

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
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
});