const { test, expect } = require("@playwright/test");

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartProducts = page.locator("div li").first();
    this.productsText = page.locator(".card-body b");
    this.cartHeader = page.locator("[routerlink*='cart']");
    this.ordersHeader = page.locator("button[routerlink*='myorders']");
    this.checkoutBtn = page.locator("text=Checkout");
  }

  async verifyProductInCart(productName) {
    await this.cartProducts.waitFor();
    const bool = await this.getProductLocator(productName).isVisible();
    expect(bool).toBeTruthy();
  }

  async checkout() {
    await this.checkoutBtn.click();
  }

  getProductLocator(productName) {
    return this.page.locator("h3:has-text('" + productName + "')");
  }
}
module.exports = { CartPage };
